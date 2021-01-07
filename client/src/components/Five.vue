<template>
<div class="flex flex-col justify-center m-4 p-4">
  <h1 class="text-3xl text-indigo-800">Hello!</h1>
  <div class="flex h-48 w-full border bg-gray-100 text-indigo-600 overflow-auto">
    <ul>
      <li v-for="(m,index) in message" :key="index"> {{m}}</li>
    </ul>
  </div>
  <div class="flex flex-row ">
    <input v-model="chat" type="text" class="border text-indigo-800 flex-grow" />
    <button @click="send" class="bg-indigo-800 text-gray-300 hover:text-white hover:cursor-pointer py-1 px-4">
      Send</button>
  </div>
</div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: 'Five',
  data() {
    return {
      chat: "",
      message: [],
      socket: io('http://192.168.1.6:3000')
    }
  },
  created() {
    this.socket.on('welcome', (text) => {
      console.log(text);
      this.message.unshift(text);
    });
    this.socket.on('message', (text) => {
      console.log(text);
      this.message.unshift(text);
    })
  },
  methods: {
    send() {
      console.log(this.chat);
      if (this.chat.length > 0) {
        this.socket.emit("message", this.chat);
        this.chat = ""; //clear input 
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
