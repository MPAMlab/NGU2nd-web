<template>
  <div v-if="loading">加载中...如果卡在此页面请联系管理员或邮件至i@mpam-lab.xyz</div>
  <div v-else class="chat-app" @click.self="handleDropdownClose">
    <div class="header" :style="config.headerStyle">
      <div class="site-name">{{ config.siteName }}</div>
    </div>

    <div class="message-area" ref="messageAreaRef">
      <div v-for="message in messages" :key="message.id" class="message-container">
        <div class="message-item">
          <div class="avatar"></div>
           <div class="message-bubble" v-if="message.type === 'text'">
            <div v-html="message.content"></div>
           </div>
           <div class="message-bubble" v-else-if="message.type === 'preview'">
                <div class="message-content">网址预览: <a :href="message.linkUrl" target="_blank" style="color: blue; text-decoration: underline;">{{message.linkUrl}}</a></div>
            </div>
            <div class="card-message" v-else-if="message.type === 'card'">
              <div class="card-header">{{ message.title }}</div>
              <a :href="message.linkUrl" target="_blank" class="card-link">
                <div class="card-content">
                  <div class="card-text">{{ message.text }}</div>
                  <div class="card-image" v-if="message.imageUrl">
                    <img :src="message.imageUrl" :alt="message.title" :style="{width: '50px', height: '50px', objectFit: 'cover'}" />
                  </div>
                </div>
              </a>
            </div>
            <div class="card-message" v-else-if="message.type === 'img'">
                <a :href="message.imgUrl" target="_blank" class="card-link">
                   <div class="card-image">
                        <img :src="message.imgUrl" alt="image" :style="{width: '200px', height: '200px', objectFit: 'cover'}"/>
                    </div>
               </a>
            </div>
        </div>
      </div>
    </div>

    <div class="nav-bar" :style="config.navBarStyle">
      <div
        class="nav-item"
        @click.stop="toggleDropdown(navButton['navbar-id'])"
        v-for="navButton in navbar.buttons"
        :key="navButton['navbar-id']"
      >
        <font-awesome-icon v-if="navButton.dropdowns" :icon="['fas', 'bars']" class="nav-icon" />
        <span class="nav-text">{{ navButton["navbar-name"] }}</span>
          <div
          v-show="activeDropdowns.has(navButton['navbar-id'])"
          class="dropdown-menu"
          :ref="el => refs[`dropdownRef${navButton['navbar-id']}`] = el"
        >
          <div
            class="dropdown-item"
            v-for="dropdown in navButton.dropdowns"
            :key="dropdown['dropdown-id']"
            @click="handleEvent(dropdown.events)"
          >
            {{ dropdown["dropdown-name"] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBars)

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
      const config = ref({})
      const navbar = ref({buttons: []})
      const initialMessages = ref([])
      const messages = ref([])
      const activeDropdowns = ref(new Set())
      const dropdownRefs = ref(new Map())
      const messageAreaRef = ref(null)
      const refs = {}
      const loading = ref(true)
      // Replace with your R2 bucket URL
      const r2ConfigUrl = 'https://img-bucket.srt.pub/config.json';


      const sendCardMessage = (title, text, imageUrl, linkUrl) => {
      messages.value.push({
        id: Date.now(),
        title,
        text,
        imageUrl,
        linkUrl,
        type: 'card',
      })
      scrollToBottom()
    }

    const sendTextMessage = (text) => {
      messages.value.push({
        id: Date.now(),
        content: text,
        type: 'text',
      })
      scrollToBottom()
    }

    const sendImgMessage = (imgUrl) => {
        messages.value.push({
            id: Date.now(),
            imgUrl,
            type: 'img'
        })
    }

        const eventHandlers = {
        sendCardMessage: (event) => {
        sendCardMessage(
            event.title,
            event.content,
            event.imageUrl,
            event.linkUrl
        );
        },
        sendTextMessage: (event) => {
            sendTextMessage(event.message);
        },
        sendImg: (event) => {
            sendImgMessage(event.imgUrl);
        },
        sendSupportCard: () => {
            sendCardMessage(
            'NGU 组织不易',
            '如果可以的话请帮帮忙，非常感谢。（赞助后可在Staff表里写你的credit）',
            'https://ngu-img.mpam-lab.xyz/paycode.webp',
            'https://ngu-img.mpam-lab.xyz/pay-qrcode.png'
            );
            sendTextMessage('①②\n③④');
        },
        };

    const handleEvent = (events) => {
        events.forEach((event) => {
          const handler = eventHandlers[event.type];
            if (handler) {
                handler(event);
            }
         });
    };

    const toggleDropdown = (index) => {
      if (activeDropdowns.value.has(index)) {
        activeDropdowns.value.delete(index);
      } else {
        activeDropdowns.value.clear(); // 关闭其他下拉菜单
        activeDropdowns.value.add(index)
      }
    };

    const handleDropdownClose = (event) => {
      if (!dropdownRefs.value || dropdownRefs.value.size === 0 ) return
      let shouldClose = true;
      for (const [, ref] of dropdownRefs.value) {
         if(ref?.contains(event.target)){
          shouldClose = false
          break;
        }
      }

       if(shouldClose){
        activeDropdowns.value.clear()
       }
   }

    const scrollToBottom = () => {
      const messageArea = messageAreaRef.value
      if (messageArea) {
        const lastMessage = messageArea.lastElementChild
        if (lastMessage) {
          lastMessage.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }


    onMounted(async () => {
        try{
            const response = await fetch(r2ConfigUrl)
             if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
               }
             const data = await response.json();
             config.value = data.config
             navbar.value = data.navbar
            initialMessages.value = data.initialMessages

           navbar.value.buttons.forEach(button => {
            const refName = `dropdownRef${button['navbar-id']}`
            const ref =  refs[refName]
             dropdownRefs.value.set(button['navbar-id'], ref)
           })
                
            initialMessages.value.forEach(message => {
              if(message.type === 'sendCardMessage'){
               sendCardMessage(message.title, message.content, message.imageUrl, message.linkUrl)
              }
               if(message.type === 'sendTextMessage'){
                 sendTextMessage(message.message)
              }
            })

             if (window.location.hash === '#ngu3rd') {
              sendTextMessage('Dealt? Probably, I will still be at the place for you.')
              }
               loading.value = false

         document.addEventListener('click', handleDropdownClose)
        }catch(error) {
          console.error('Failed to fetch config data', error);
           loading.value = false
        }
     })

        onUnmounted(() => {
              document.removeEventListener('click', handleDropdownClose)
          })

    return {
      messages,
      activeDropdowns,
      messageAreaRef,
      config,
      navbar,
      refs,
      handleDropdownClose,
      toggleDropdown,
      handleEvent,
      loading
    }
  },
}
</script>

<style scoped>
@font-face {
    font-family: 'KORUNISH';
    src: url('./assets/fonts/KORUNISH.TTF') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap');

.chat-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  font-family: 'Noto Sans SC', sans-serif;
}
.site-name {
  font-family: 'KORUNISH', sans-serif;
  font-weight: bold;
  text-align: center;
  flex: 1;
}
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.message-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}
.message-item {
  display: flex;
  align-items: flex-start;
}
.message-area {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  margin-top: 70px;
  margin-bottom: 50px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-image: url('./assets/logo-500x500.png');
  background-size: cover;
  background-position: center;
  margin-right: 10px;
}

.message-bubble {
  max-width: 60vw;
  padding: 10px 15px;
  border-radius: 5px;
  background-color: #f0f0f0;
  white-space: pre-line;
}

.message-content {
  word-break: break-word;
  white-space: pre-wrap;
}

.card-message {
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 10px;
    max-width: 300px;
  }

  .card-header {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .card-link {
    text-decoration: none;
    color: inherit;
    display: flex;
  }

  .card-content {
    display: flex;
    align-items: center;
  }

  .card-text {
    flex: 1;
    margin-right: 10px;
    color: #666;
  }

  .card-image img {
    max-width: 50px;
    max-height: 50px;
    object-fit: cover;
    border-radius: 4px;
  }

.nav-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.nav-item {
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  user-select: none;
}

.nav-icon {
  margin-right: 5px;
  font-size: 16px;
}
.nav-text {
  display: inline-block;
  padding-left: 5px;
}
.nav-separator {
  width: 1px;
  height: 20px;
  background-color: #ccc;
}
.nav-item-content {
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
}
.dropdown-menu {
  position: absolute;
  bottom: 55px;
  left: auto;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px 0;
  min-width: 100px;
}

.dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
