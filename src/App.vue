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
              <img :src="message.imageUrl" :alt="message.title">
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</div>
    <!-- 其他部分保持不变 -->
    <div class="nav-bar">
      <div class="nav-item" @click.stop="toggleDropdown(1, 3)">
      <font-awesome-icon :icon="['fas', 'bars']" class="nav-icon" />
      <span class="nav-text">比赛介绍</span>
      <div v-show="showDropdown[1]" class="dropdown-menu" ref="dropdownRef1">
        <div class="dropdown-item" @click="sendCardMessage('赛制介绍', 'NGU2nd 比赛赛制介绍','','./tournament-introduction.html')">赛制介绍</div>
        <div class="dropdown-item" @click="sendCardMessage('技能牌介绍', 'NGU2nd 比赛用技能牌介绍', '', './card-introduction.html')">技能牌介绍</div>
        <div class="dropdown-item" @click="sendTextMessagesFromJSON(0)">STAFF表</div>
        <div class="dropdown-item" @click="sendNGU1stCard">NGU 1st</div>
      </div>
    </div>
      <div class="nav-separator"></div>
      <div class="nav-item" @click="sendCardMessage('舞萌DX / 中二节奏 登入二维码', '把下方二维码对准机台扫描处，可用机台有【舞萌DX ？？？】', 'https://qr-start.srt.pub/not_project_raputa.png', 'https://mpam-lab.xyz/qr-code')">
        <span class="nav-text">玩家二维码</span>
      </div>
      <div class="nav-separator"></div>
      <div class="nav-item" @click.stop="toggleDropdown(3, 1)">
        <font-awesome-icon :icon="['fas', 'bars']" class="nav-icon" />
        <span class="nav-text">更多</span>
        <div v-show="showDropdown[3]" class="dropdown-menu" ref="dropdownRef3">
          <div class="dropdown-item" @click="sendCardMessage('NGU 2nd 舞萌比赛直播', '哔哩哔哩直播 - UP主：nonefffds - 房间号：10910411', '', 'https://live.bilibili.com/10910411')">比赛直播间</div>
          <div class="dropdown-item">下载配布资源（赛后解锁）</div>
          <!--<div class="dropdown-item" @click="sendCardMessage('文件下载','サカサカバンバンバスピスピス.zip\n 1.5MB', require('@/assets/download.png'), 'https://fds.srt.pub/simai/sakasakabanbanbasupisupisu/%E3%82%B5%E3%82%AB%E3%82%B5%E3%82%AB%E3%83%90%E3%83%B3%E3%83%90%E3%83%B3%E3%83%90%E3%82%B9%E3%83%94%E3%82%B9%E3%83%94%E3%82%B9.zip')">文件下载测试</div>-->
          <div class="dropdown-item">？？？（赛后解锁）</div>
          <div class="dropdown-item" @click="sendTextMessagesFromJSON(1)">关于本网站/隐私权政策</div>
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
import textMessagesData from './assets/text.json'
//import Post from './post.vue'
//const cardMessages = ref(cardMessageData);
library.add(faBars)
export default {
  components: {
    FontAwesomeIcon,
    //Post
  },
  methods: {
    sendNGU1stCard() {
      this.sendCardMessage('NGU 1st （比赛日期 2023/5/15）', 'Produced by @DJDoDo @煤球大大煤球，Supported by 游戏大魔方（新悦荟店)，点击查看规则公告牌', '', './ngu1st-rule.webp');
      this.sendCardMessage('比赛合照', 'NGU 1st 优胜者：Stella， 点击查看参与者合照', '', './ngu1st.webp');
      this.sendCardMessage('直播回放', '哔哩哔哩 - 第一届NGU——"Never Give Up杯"游戏大魔方maimai娱乐赛 - UP主：Rimrose', '', 'https://www.bilibili.com/video/BV1NV4y1k7Ek/');
    }
  },
  setup() {

    const messages = ref([])
    const textMessages = ref([])
    const sendPreviewMessage = (url) => {
      messages.value.push({
        id: Date.now(),
        content: `网址预览: ${url}`,
        isCard: false
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
        isCard: true
      })
      scrollToBottom()
    }
    const showDropdown = ref({
      1: false,
      3: false
    })
    const dropdownRef1 = ref(null)
    const dropdownRef3 = ref(null)
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
      if (
        (dropdownRef1.value && !dropdownRef1.value.contains(event.target)) &&
        (dropdownRef3.value && !dropdownRef3.value.contains(event.target))
      ) {
        showDropdown.value[1] = false
        showDropdown.value[3] = false
      }
    }
    const sendTextMessage = (text) => {
      messages.value.push({
        id: Date.now(),
        content: text,
        isCard: false,
        isText: true
      })
      scrollToBottom()
    }
    const loadTextMessages = () => {
      textMessages.value = textMessagesData
    }


    const sendTextMessagesFromJSON = (index) => {
      sendTextMessage(textMessages.value[index])
    }
    const messageAreaRef = ref(null)

    const scrollToBottom = () => {
      const messageArea = messageAreaRef.value
      if (messageArea) {
        const lastMessage = messageArea.lastElementChild
        if (lastMessage) {
          lastMessage.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    loadTextMessages()
    sendCardMessage('你好，欢迎来到 NGU 2nd 比赛官网', '本网站下方有本次比赛的相关信息，请进行查看及参考', '', '')
    sendCardMessage('如需更多比赛相关帮助', '请联系b站官方账号 @灯射来红音游协会。如有网站相关问题，请联系邮箱 i@MPAM-Lab.xyz', '', 'https://space.bilibili.com/3546613924497542/')
    // 在组件挂载时,添加点击事件监听器
    onMounted(() => {
      document.addEventListener('click', handleOutsideClick)
    })

    // 在组件卸载时,移除点击事件监听器
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
      dropdownRef1,
      dropdownRef3,
      textMessages,
      sendTextMessage,
      sendTextMessagesFromJSON,
      //cardMessages,
    }
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
  height: 50px;
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
  display: flex; /* 新增 */
  align-items: center; /* 新增 */
  justify-content: center;
  flex: 1;
  height: 100%; /* 新增 */
  user-select: none;
}

.nav-icon {
  margin-right: 5px;
  font-size: 16px; /* 调整图标大小 */
}
.nav-text {
  display: inline-block;
  padding-left: 5px; /* 新增 */
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
  user-select: none; /* 禁止选中文本 */
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