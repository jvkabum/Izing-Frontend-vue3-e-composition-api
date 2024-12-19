<template>
  <div style="width: 450px">
    <div class="main">
      <div class="inner">
        <div class="top-bar">
          <div class="cam"></div>
          <div class="speaker"></div>
        </div>
        <div class="screen">
          <div>
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Componente puramente visual, não necessita lógica
</script>

<style lang="scss">
.main {
  width: 400px;
  height: 450px;
  background: #000000;
  padding: 30px;
  border-radius: 2em;
}

.inner {
  border-radius: 20em;
  width: 390px;
  height: 430px;
  background: #fff;
  padding: 10px;
  margin-left: -25px;
  border-radius: 2em;
  margin-top: -24px;
}

.cam {
  background: black;
  width: 20px;
  height: 20px;
  border-radius: 20em;
  margin-left: 50px;
}

.speaker {
  width: 40px;
  height: 10px;
  background: linear-gradient(90deg, grey 20%, white 30%, black 40%);
  border-radius: 0.5em;
  margin-left: 165px;
  margin-top: -12px;
}

.screen {
  background: #eeecece1;
  width: 380px;
  height: 370px;
  margin-top: 10px;
  margin-left: -5px;
  overflow: auto;

  div {
    white-space: normal;
    word-wrap: break-word;
  }
}
</style>
