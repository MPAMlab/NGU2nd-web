<template>
    <div class="post-container">
      <header class="header">
        <div class="close-btn" @click="$emit('close')">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </div>
      </header>
      <main class="content" v-html="renderedContent"></main>
    </div>
  </template>
  
  <script>
  import marked from 'marked'
  
  export default {
    name: 'Post',
    props: {
      content: {
        type: String,
        required: true
      }
    },
    computed: {
      renderedContent() {
        return marked(this.content, { breaks: true })
      }
    }
  }
  </script>
  
  <style scoped>
  .post-container {
    position: relative;
    height: 100%;
    overflow: auto;
  }
  
  .header {
    position: sticky;
    top: 0;
    background-color: #fff;
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    z-index: 1;
  }
  
  .close-btn {
    cursor: pointer;
  }
  
  .content {
    padding: 20px;
  }
  
  .content >>> h1,
  .content >>> h2,
  .content >>> h3,
  .content >>> h4,
  .content >>> h5,
  .content >>> h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  .content >>> p {
    line-height: 1.5;
    margin-bottom: 1em;
  }
  
  .content >>> img {
    max-width: 100%;
    height: auto;
  }
  
  @media (max-width: 768px) {
    .content {
      padding: 10px;
    }
  }
  </style>