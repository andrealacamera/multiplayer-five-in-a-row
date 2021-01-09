<template>
<div class="flex flex-col justify-center m-4 p-4">
  <h1 class="text-3xl text-indigo-800">Hello!</h1>
  <h2 class="text-xl text-indigo-600" v-if="welcome.length>0">{{welcome}}</h2>
  <div class="border flex justify-center">
    <div class="border border-indigo-800">
      <canvas id="canvas" width="400" height="400" @click="square($event)"></canvas>
    </div>
  </div>
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
      numCells:10,
      chat: "",
      welcome: "",
      message: [],
      socket: io('http://192.168.1.6:3000'),
      ctx:null,
      canvas:null,
      origin:{},
    }
  },
  computed: {
      cellSize() {
        return Math.floor(this.canvas.width/this.numCells);
      }

  },
  mounted() {
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    this.ctx = ctx;
    this.canvas = c;    
    // listen to scroll 
    window.addEventListener('scroll', this.handleClicks);

    //socket messages
    this.socket.on('welcome', (text) => {
      //console.log(text);
      this.welcome = text;
    });
    this.socket.on('message', (text) => {
      //console.log(text);
      this.message.unshift(text);
    });
    this.socket.on('board', (board) => {
      // console.log(board);
      this.reset(board);
    })
    this.socket.on('turn', (data) => {
      //console.log(data);
      const {x,y,color} = data;
      this.fillCell(x,y,color);
    })
  },
  updated() {
    this.handleClicks();
  },
  methods: {
    handleClicks() {
    const {top,left} = this.canvas.getBoundingClientRect();
    this.origin.x=left;
    this.origin.y=top;
    },
    send() {
      // console.log(this.chat);
      if (this.chat.length > 0) {
        this.socket.emit("message", this.chat);
        this.chat = ""; //clear input 
      }
    },
    square(e) {
      // console.log([e.clientX, e.clientY], [e.screenX, e.screenY]);
      const x=e.clientX - this.origin.x;
      const y=e.clientY - this.origin.y; 
      //this.fillRect(e.clientX,e.clientY, '#ff5500');
      this.socket.emit('turn', this.getCellCoordinates(x,y));
    },
    // fillRect(x,y,color) {
    //   this.ctx.fillStyle = color;
    //   this.ctx.fillRect(x, y, 20,20);
    // },
    fillCell(x,y,color) {
      this.ctx.fillStyle=color;
      this.ctx.fillRect(x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize);
    },
    getCellCoordinates(x,y) {
      return {
        x: Math.floor(x/this.cellSize),
        y: Math.floor(y/this.cellSize)
      }
    },
    drawGrid() {
      //draw the grid on canvas;
      this.ctx.beginPath();
      for (let i=0; i<this.numCells+1; i++) {
        this.ctx.moveTo(i*this.cellSize, 0);
        this.ctx.lineTo(i*this.cellSize, this.canvas.height);
        this.ctx.moveTo(0, i*this.cellSize);
        this.ctx.lineTo(this.canvas.width, i*this.cellSize);
      }
      this.ctx.strokeStyle='#666'
      this.ctx.stroke();
    },
    clear() {
      this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    },
    reset(board) {
      this.clear();
      this.drawGrid();
      this.renderBoard(board);
    },
    renderBoard(board=[]) {
      //forEach( callback(currentValue, index) )
      //2D array is array of array (first rows)
      board.forEach( (row, y) => {
        row.forEach( (color, x) => {
          // short for if (color) { call the function }
          color && this.fillCell(x,y,color);
          //console.log(x,y,color);
        });  
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
