<template>
  <div class="chat-app" @click.self="closeDropdown">
    <div class="header">
      <div class="site-name">Never Give Up 2nd</div>
    </div>

    <div class="message-area" ref="messageAreaRef">
      <div v-for="message in messages" :key="message.id" class="message-container">
        <div class="message-item">
          <div class="avatar"></div>
          <div class="message-bubble" v-if="message.isText">
            <div v-html="message.content"></div>
          </div>
          <div class="message-bubble" v-else-if="!message.isCard">
            <div class="message-content">{{ message.content }}</div>
          </div>
          <div class="card-message" v-else>
            <div class="card-header">{{ message.title }}</div>
            <a :href="message.linkUrl" target="_blank" class="card-link">
              <div class="card-content">
                <div class="card-text">{{ message.text }}</div>
                <div class="card-image" v-if="message.imageUrl">
                  <img :src="message.imageUrl" :alt="message.title" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-bar">
      <div
        class="nav-item"
        @click.stop="toggleDropdown(1, 3)"
        v-for="navButton in configData.navbar.buttons"
        :key="navButton['navbar-id']"
      >
        <font-awesome-icon v-if="navButton.dropdowns" :icon="['fas', 'bars']" class="nav-icon" />
        <span class="nav-text">{{ navButton["navbar-name"] }}</span>
        <div
          v-show="showDropdown[navButton['navbar-id']]"
          class="dropdown-menu"
          :ref="`dropdownRef${navButton['navbar-id']}`"
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
import configData from './assets/config.json'

library.add(faBars)

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const messages = ref([])
    const showDropdown = ref({})

    const sendPreviewMessage = (url) => {
      messages.value.push({
        id: Date.now(),
        content: `网址预览: ${url}`,
        isCard: false,
      })
      scrollToBottom()
    }

    const sendCardMessage = (title, text, imageUrl, linkUrl) => {
      messages.value.push({
        id: Date.now(),
        title,
        text,
        imageUrl,
        linkUrl,
        isCard: true,
      })
      scrollToBottom()
    }

    const sendTextMessage = (text) => {
      messages.value.push({
        id: Date.now(),
        content: text,
        isCard: false,
        isText: true,
      })
      scrollToBottom()
    }

    const toggleDropdown = (index, otherIndex) => {
      showDropdown.value[index] = !showDropdown.value[index]
      if (showDropdown.value[index]) {
        showDropdown.value[otherIndex] = false
      }
    }

    const closeDropdown = (index) => {
      showDropdown.value[index] = false
    }

    const handleOutsideClick = (event) => {
      const dropdownRefs = Object.values(showDropdown.value).map((_, index) => `dropdownRef${index + 1}`)
      const dropdownElements = dropdownRefs.map((ref) => refs[ref].value)

      if (dropdownElements.every((dropdown) => dropdown && !dropdown.contains(event.target))) {
        Object.keys(showDropdown.value).forEach((index) => {
          showDropdown.value[index] = false
        })
      }
    }

    const handleEvent = (events) => {
      events.forEach((event) => {
        switch (event['type']) {
          case 'sendCardMessage':
            sendCardMessage(
              event['card-title'],
              event['card-content'],
              event['card-image'],
              event['card-link']
            )
            break
          case 'sendTextMessage':
            sendTextMessage(event['message'])
            break
          case 'sendImg':
            sendCardMessage('', '', event['img-link'], event['img-link'])
            break
          case 'sendSupportCard':
            sendCardMessage(
              'NGU 组织不易',
              '如果可以的话请帮帮忙，非常感谢。（赞助后可在Staff表里写你的credit）',
              'https://ngu-img.mpam-lab.xyz/paycode.webp',
              'https://ngu-img.mpam-lab.xyz/pay-qrcode.png'
            )
            sendTextMessage('①②\n③④')
            break
          // Add more cases as needed
          default:
            break
        }
      })
    }

    const messageAreaRef = ref(null)
    const refs = {}

    const scrollToBottom = () => {
      const messageArea = messageAreaRef.value
      if (messageArea) {
        const lastMessage = messageArea.lastElementChild
        if (lastMessage) {
          lastMessage.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    // Initialize the showDropdown object
    configData.navbar.buttons.forEach((button) => {
      showDropdown.value[button['navbar-id']] = false
    })

    sendCardMessage('你好，欢迎来到 NGU 2nd 比赛官网', '本网站下方有本次比赛的相关信息，请进行查看及参考', '', '')
    sendCardMessage(
      '如需更多比赛相关帮助',
      '请联系b站官方账号 @灯射来红音游协会。如有网站相关问题，请联系邮箱 i@MPAM-Lab.xyz',
      '',
      'https://space.bilibili.com/3546613924497542/'
    )
    sendCardMessage(
      '本网站仅作为内部活动宣传所用',
      '本网站为静态网站，所有内容均为合法范围，且无不良引导。本网站无评论等交互功能',
      '',
      ''
    )

    onMounted(() => {
      document.addEventListener('click', handleOutsideClick)
      if (window.location.hash === '#ngu3rd') {
        sendTextMessage('Dealt? Probably, I will still be at the place for you.')
      }
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleOutsideClick)
    })

    return {
      messages,
      showDropdown,
      messageAreaRef,
      toggleDropdown,
      sendPreviewMessage,
      sendCardMessage,
      closeDropdown,
      handleEvent,
      refs,
      textMessages,
      sendTextMessage,
      configData}
      }
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
  overflow: hidden;
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
  background-color: #baaffe;
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
  background-color: #f0f0f0;
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