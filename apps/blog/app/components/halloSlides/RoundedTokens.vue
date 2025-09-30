<template>
  <div class="SamSlide RoundedTokens">
    <p class="display">
      <span>--radius-1:</span> 00px;<br />
      <span>--radius-2:</span> 10px;<br />
      <span>--radius-3:</span> 30px;
    </p>

    <div class="RoundedExamples">
      <div class="Example border"></div>
      <div class="Example border"></div>
      <div class="Example border"></div>
    </div>
  </div>
</template>

<style>
.RoundedTokens {
  --radius-1: 0px;
  --radius-2: 10px;
  --radius-3: 30px;

  display: flex;
  gap: var(--space-5);
}

.RoundedExamples {
  transform: translate(0, -50px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 30em;
}

.Example {
  position: absolute;
  height: 100px;
  width: 100%;
  background: var(--base-20);
}

.Example:nth-child(1)::after,
.Example:nth-child(2)::after {
  content: '';
  display: block;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--base);
  transform: translate(25px, 30px);
  filter: blur(20px);
}

.Example:nth-child(1) {
  border-top-left-radius: var(--radius-1);
}

.Example:nth-child(2) {
  border-top-left-radius: var(--radius-2);
  transform: translate(50px, 50px);
}

.Example:nth-child(3) {
  border-top-left-radius: var(--radius-3);
  transform: translate(100px, 100px);
}
</style>
