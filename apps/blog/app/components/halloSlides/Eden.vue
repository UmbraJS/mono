<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, useTemplateRef } from 'vue';

const { stage = 3 } = defineProps<{ stage: number; }>();

const eden = useTemplateRef('eden');
const shape1 = useTemplateRef('shape1');
const shape2 = useTemplateRef('shape2');

function state(stage: number) {
  switch (stage) {
    case 2:
      return "shade"
    case 3:
      return "space"
    case 4:
      return "shape"
    case 5:
      return "intimate"
    case 6:
      return "divorced"
    case 7:
      return "empty"
    case 8:
      return "exit"
    default:
      return "eden"
  }
}

const from = {
  scale: 5,
  opacity: 0
};

const duration = 0.4;

function enterFrame() {
  gsap.fromTo(
    eden.value,
    from,
    {
      scale: 1,
      opacity: 1,
      duration,
    }
  );
}

function enterEden() {
  gsap.to(shape1.value, {
    width: "0%",
    duration,
  });

  gsap.to(shape2.value, {
    width: "0%",
    duration,
  });
}

function enterShade() {
  gsap.to(shape1.value, {
    width: "50%",
    duration,
  });

  gsap.to(shape2.value, {
    width: "0%",
    duration,
  });
}

function enterSpace() {
  gsap.to(shape1.value, {
    width: "30%",
    height: "100%",
    marginLeft: "0%",
    duration,
  });

  gsap.to(shape2.value, {
    width: "30%",
    height: "100%",
    marginRight: "0%",
    duration,
  });
}

function enterShapes() {
  gsap.to(shape1.value, {
    height: "50%",
    width: "20%",
    marginLeft: "20%",
    duration,
  });

  gsap.to(shape2.value, {
    height: "50%",
    width: "20%",
    marginRight: "20%",
    duration,
  });
}

function enterIntimate() {
  gsap.to(shape1.value, {
    marginLeft: "29%",
    duration,
  });

  gsap.to(shape2.value, {
    marginRight: "29%",
    duration,
  });
}

function enterDivorced() {
  gsap.to(shape1.value, {
    height: "50%",
    width: "20%",
    marginLeft: "5%",
    duration,
  });

  gsap.to(shape2.value, {
    height: "50%",
    width: "20%",
    marginRight: "5%",
    duration,
  });

  gsap.to(eden.value, {
    scale: 1,
    opacity: 1,
    duration,
  });

  gsap.to(shape2.value, {
    height: "50%",
    width: "20%",
    marginRight: "5%",
    duration,
  });
}

function emptyFrame() {

  gsap.to(shape1.value, {
    height: "50%",
    width: "0%",
    marginLeft: "0%",
    duration,
  });

  gsap.to(shape2.value, {
    height: "50%",
    width: "0%",
    marginRight: "0%",
    duration,
  });

  gsap.to(eden.value, {
    scale: 1,
    opacity: 1,
    duration,
  });
}

function exitFrame() {
  gsap.to(eden.value, {
    scale: 5,
    opacity: 0,
    duration: duration + 0.6,
  });
}

watch(() => stage, (newStage, oldStage) => {
  const stageState = state(newStage);

  if (stageState === "eden") {
    enterEden();
  } else if (stageState === "shade") {
    enterShade();
  } else if (stageState === "space") {
    enterSpace();
  } else if (stageState === "shape") {
    enterShapes();
  } else if (stageState === "intimate") {
    enterIntimate();
  } else if (stageState === "divorced") {
    enterDivorced();
  } else if (stageState === "empty") {
    emptyFrame();
  } else if (stageState === "exit") {
    exitFrame();
  }
});

onMounted(() => {
  enterFrame();
});
</script>

<template>
  <div ref="eden" class="SamSlide" :class="state(stage)">
    <div class="Eden border">
      <div ref="shape1" class="Shape"></div>
      <div ref="shape2" class="Shape"></div>
    </div>
  </div>
</template>

<style>
.Shape {
  background: black;
  height: 100%;
  transition: .4s ease-in-out;
}

.Eden {
  display: flex;
  justify-content: flex-start;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  width: 70vw;
  height: 70vh;
  background-color: white;
  border-radius: var(--radius);
  transition: .4s ease-in-out;
}

/* .shade .Shape:nth-child(1) {
  width: 50%;
  height: 100%;
} */

/* .space .Shape {
  width: 35%;
  height: 100%;
} */
</style>
