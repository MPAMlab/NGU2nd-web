<template>
  <div class="chat-app">
    <div class="header">
      <div class="site-name">Never Give Up The 2nd</div>
    </div>
    <div class="message-area">
      <div v-for="message in messages" :key="message.id" class="message-container">
        <div class="message-item">
          <div class="avatar"></div>
          <div class="message-bubble" v-if="!message.isCard">
            <div class="message-content">{{ message.content }}</div>
          </div>
          <div class="card-message" v-else>
            <div class="card-header">{{ message.title }}</div>
            <a :href="message.linkUrl" target="_blank">
              <div class="card-content">
                <div class="card-text">{{ message.text }}</div>
                <div class="card-image">
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
      <div class="nav-item" @click="sendPreviewMessage('https://example.com/1')">
        <span class="nav-text">首页</span>
      </div>
      <div class="nav-separator"></div>
      <div class="nav-item" @click="sendCardMessage('舞萌DX / 中二节奏 登入二维码', '把下方二维码对准机台扫描处，可用机台有【舞萌DX ？？？】', 'https://qr-start.srt.pub/not_project_raputa.png', 'https://qr-start.srt.pub/')">
        <span class="nav-text">玩家二维码</span>
      </div>
      <div class="nav-separator"></div>
      <div class="nav-item" @click="sendPreviewMessage('https://example.com/1')">
        <font-awesome-icon :icon="['fas', 'bars']" class="nav-icon" />
        <span class="nav-text">首页</span>
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
    FontAwesomeIcon
  },
  setup() {
    const messages = ref([])



    const sendPreviewMessage = (url) => {
      messages.value.push({
        id: Date.now(),
        content: `网址预览: ${url}`,
        isCard: false
      })
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
    }

    return {
      messages,
      
      sendPreviewMessage,
      sendCardMessage,
    }
  }
}
</script>

<style scoped>
.chat-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.site-name {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  text-align: center;
  flex: 1;
}
.header {
  display: flex;
  justify-content: center; 
  align-items: center;
  height: 60px;
  background-color: #f0f0f0;
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
  padding: 20px;
  overflow-y: auto;
  margin-top: 70px;
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
}

.message-content {
  word-break: break-word; 
  white-space: pre-wrap; 
}

.card-message {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  max-height: 400px;
  overflow: hidden;
}

.card-header {
  background-color: #f0f0f0;
  padding: 10px 15px;
  font-weight: bold;
}

.card-content {
  padding: 15px;
}

.card-text {
  margin-bottom: 10px;
}

.card-image img {
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
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


</style>