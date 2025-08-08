<script setup lang="ts"></script>

<template>
  <div class="typography">
    <div class="display-content">
      <h1 class="display">Display header</h1>
      <p class="display">
        <strong>Display text</strong> - Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        Beatae distinctio earum in. Enim dignissimos deserunt officiis nam, ullam, facere quod, illo
        fuga sit aliquam minus sint aspernatur quisquam molestiae ex!
      </p>

      <div class="usercard">
        <div class="avatar">
          <img src="https://picsum.photos/200" alt="avatar" />
        </div>
        <div class="content">
          <p class="name"><strong>John Doe - [p strong]</strong></p>
          <p class="caption">489 posts - [p.caption]</p>
        </div>
      </div>
    </div>

    <h1>h1 - Main title</h1>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae distinctio earum in. Enim
      dignissimos deserunt officiis nam, ullam, facere quod, illo fuga sit aliquam minus sint
      aspernatur quisquam molestiae ex!
    </p>
    <h2>h2 - Subtitle</h2>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi quae labore inventore, in,
      autem facere maxime exercitationem provident perferendis, delectus iure corrupti quia id!
      Corrupti, quo. Optio repellat sit perspiciatis?
    </p>
    <h3>h3 - Header 3</h3>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi quae labore inventore, in,
      autem facere maxime exercitationem provident perferendis, delectus iure corrupti quia id!
      Corrupti, quo. Optio repellat sit perspiciatis?
    </p>
    <h4>h4 - Header 4</h4>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi quae labore inventore, in,
      autem facere maxime exercitationem provident perferendis, delectus iure corrupti quia id!
      Corrupti, quo. Optio repellat sit perspiciatis?
    </p>
    <h5>h5 - Header 5</h5>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi quae labore inventore, in,
      autem facere maxime exercitationem provident perferendis, delectus iure corrupti quia id!
      Corrupti, quo. Optio repellat sit perspiciatis?
    </p>
    <h6>h6 - Header 6</h6>
    <p class="caption">
      [1] We are not legally responsible for any damages or losses that may occur from using our
      services
    </p>
  </div>
</template>

<style scoped>
.display-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-bottom: var(--space-5);
  padding-top: var(--space-3);
}

.usercard {
  position: relative;
  display: flex;
  gap: var(--space-2);
  align-items: center;
  background: var(--base-120);
  color: var(--base-10);
  border-radius: var(--radius);
  margin-top: var(--space-2);
}

.usercard .avatar {
  width: 100px;
  height: 100px;
  border-radius: var(--radius) 0 0 var(--radius);
  overflow: hidden;
}

.typography {
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  height: max-content;
  padding-bottom: var(--space-7);
}

.typography>*:not(p) {
  margin-top: var(--space-2);
}
</style>
