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
            <div class="card-content">
              <div class="card-text">{{ message.text }}</div>
              <div class="card-image">
                <img :src="message.imageUrl" :alt="message.title">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-bar">
      <div class="nav-item" @click="sendPreviewMessage('https://example.com/1')">
        <span class="nav-text">首页</span>
      </div>
      <div class="nav-separator"></div>
      <div class="nav-item" @click="sendCardMessage('舞萌DX / 中二节奏 登入二维码')">
        <span class="nav-text">玩家二维码</span>
      </div>
      <div class="nav-separator"></div>
      <div class="nav-item sub-nav-container" ref="subNavContainer">
        <div class="nav-item-content" @click.stop="toggleSubNav">
          <font-awesome-icon icon="['fas', 'bars']" />
          <span class="nav-text">比赛介绍</span>
        </div>
        <div class="sub-nav" v-show="showSubNav" ref="subNav">
          <div class="sub-nav-item" @click="sendSubNavMessage('子导航消息1')">子导航1</div>
          <div class="sub-nav-item" @click="sendSubNavMessage('子导航消息2')">子导航2</div>
          <div class="sub-nav-item" @click="sendSubNavMessage('子导航消息3')">子导航3</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
export default {
  setup() {
    const messages = ref([])
    const showSubNav = ref(false)
    const subNavContainer = ref(null)
    const subNav = ref(null)



    const sendPreviewMessage = (url) => {
      messages.value.push({
        id: Date.now(),
        content: `网址预览: ${url}`,
        isCard: false
      })
    }

    const sendCardMessage = (title, text, imageUrl) => {
      messages.value.push({
        id: Date.now(),
        title,
        text,
        imageUrl,
        isCard: true
      })
    }

    const toggleSubNav = () => {
      showSubNav.value = !showSubNav.value
      positionSubNav()
    }

    const sendSubNavMessage = (content) => {
      messages.value.push({
        id: Date.now(),
        content,
        isCard: false
      })
      showSubNav.value = false
    }

    const closeSubNav = () => {
      showSubNav.value = false
    }

    const positionSubNav = () => {
  if (subNav.value && subNavContainer.value) {
    const containerRect = subNavContainer.value.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // 确保子导航不会跑到视口之外
    let leftPosition = containerRect.left + scrollX;
    let topPosition = containerRect.bottom + scrollY;

    // 你可以添加额外的逻辑来限制subNav的位置
    // 例如，根据视口的宽度来调整位置，防止它溢出屏幕
    const subNavWidth = subNav.value.offsetWidth;
    const viewportWidth = window.innerWidth;
    if (leftPosition + subNavWidth > viewportWidth) {
      leftPosition = viewportWidth - subNavWidth;
    }

    subNav.value.style.left = `${leftPosition}px`;
    subNav.value.style.top = `${topPosition}px`;
  }
}

    onMounted(() => {
      window.addEventListener('resize', positionSubNav)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', positionSubNav)
    })

    return {
      messages,
      showSubNav,
      subNavContainer,
      subNav,
      sendPreviewMessage,
      sendCardMessage,
      toggleSubNav,
      sendSubNavMessage,
      closeSubNav
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
.site-name{
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  text-align: center;
  display: flex;
  justify-content: center;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  background-color: #f0f0f0;
  padding: 0 20px;
  position: fixed; /* 固定头部 */
  top: 0; /* 头部置顶 */
  left: 0;
  right: 0; /* 头部宽度延伸到视口宽度 */
  z-index: 1000; /* 确保头部在最上层 */
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
  height: 100px;
  background-color: #f0f0f0;
  position: fixed; /* 固定导航栏 */
  bottom: 0; /* 导航栏置底 */
  left: 0;
  right: 0; /* 导航栏宽度延伸到视口宽度 */
  z-index: 1000; /* 确保导航栏在最上层 */
}

.nav-item {
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  user-select: none; /* 禁止选中文本 */
}

.nav-icon {
  margin-right: 5px;
}

.nav-separator {
  width: 1px;
  height: 20px;
  background-color: #ccc;
}

.sub-nav-container {
  position: relative;
}

.nav-item-content {
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none; /* 禁止选中文本 */
}

.sub-nav {
  position: absolute;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1;
  min-width: 150px;
}

.sub-nav-item {
  cursor: pointer;
  padding: 5px 10px;
  white-space: nowrap;
}

.sub-nav-item:hover {
  background-color: #f0f0f0;
}


</style>