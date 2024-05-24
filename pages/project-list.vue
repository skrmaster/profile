<script lang="ts" setup>

useHead({
  title: "项目列表"
});
const data = [
  {
    name: '熊猫系统',
    imageUrl: '/images/pd3.png'
  },
  {
    name: '熊猫系统2',
    imageUrl: '/images/pd3.png'
  },
  {
    name: '熊猫系统2',
    imageUrl: '/images/pd3.png'
  },
  {
    name: '熊猫系统2',
    imageUrl: '/images/pd3.png'
  },
  {
    name: '熊猫系统2',
    imageUrl: '/images/pd3.png'
  },
  {
    name: '熊猫系统2',
    imageUrl: '/images/pd3.png'
  }
]

</script>
<template>
  <com-background
    :bg-change-color="false"
    :bg-style-content="''"
    :bg-default-size="true"
  >
    <com-navigation></com-navigation>
    <section>
      <div class="container">
        <div>
          <p class="my3 fs24">项目列表</p>
          <div class="project-gird">
            <div class="project__item" 
              v-for="(item, index) in data" 
              :key="index"
            >
              <div class="project__image">
                <img :src="item.imageUrl" />
              </div>
              <p class="text-center my1">{{ item.name }}</p>
            </div>
          </div>
        </div>
        <com-pagination></com-pagination>
      </div>
    </section>
  </com-background>
</template>
<style scoped>
.project-gird {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(311px, 1fr));
  gap: 30px;
}

.project__item {
  border-radius: 10px;
  background-color: var(--white-color);
  box-shadow: var(--box-shadow);
}

.project__image {
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  cursor: pointer;
}

.project__image img {
  max-width: 100%;
  transition: all .2s ease-in-out;
}

.project__image img:hover {
  transform-origin: center center;
  transform: scale(1.2);
}
</style>