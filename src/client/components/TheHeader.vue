<template>
  <header class="bg-white border-b border-gray-200">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          免费字体收录
        </router-link>
        <nav class="flex items-center gap-6">
          <router-link to="/" class="text-gray-600 hover:text-gray-900 transition-colors" active-class="text-blue-600 font-medium">
            字体
          </router-link>
          <router-link to="/licenses" class="text-gray-600 hover:text-gray-900 transition-colors" active-class="text-blue-600 font-medium">
            协议
          </router-link>
          <router-link to="/about" class="text-gray-600 hover:text-gray-900 transition-colors" active-class="text-blue-600 font-medium">
            关于
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>
