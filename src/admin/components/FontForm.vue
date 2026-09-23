<template>
  <el-form label-width="120px" @submit.prevent="onSubmit">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="Slug" required>
          <el-input v-model="form.slug" :disabled="!!initial" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="版本" required>
          <el-input v-model="form.version" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="中文名">
          <el-input v-model="form.nameZh" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="英文名">
          <el-input v-model="form.nameEn" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="厂商" required>
          <el-input v-model="form.vendor" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="许可" required>
          <el-select v-model="form.licenseId" placeholder="选择许可" class="w-full">
            <el-option v-for="l in licenses" :key="l.id" :label="l.name" :value="l.id" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="选择分类" clearable class="w-full">
            <el-option v-for="c in CATEGORIES" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="官方网站">
          <el-input v-model="form.officialUrl" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="简介">
      <el-input v-model="form.description" type="textarea" :rows="3" />
    </el-form-item>

    <el-form-item label="详细内容">
      <el-input v-model="form.content" type="textarea" :rows="8" class="font-mono" />
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="语言">
          <el-checkbox-group v-model="form.languages">
            <el-checkbox v-for="lang in LANGUAGES" :key="lang" :value="lang" :label="lang" />
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="格式">
          <el-checkbox-group v-model="form.formats">
            <el-checkbox v-for="f in ['TTF', 'OTF', 'WOFF2']" :key="f" :value="f" :label="f" />
          </el-checkbox-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="字重">
          <el-checkbox-group v-model="form.weights">
            <el-checkbox v-for="w in WEIGHTS" :key="w" :value="w" :label="w" />
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="标签">
      <el-input v-model="tagsInput" placeholder="逗号分隔，如：免费, 商用, 黑体" />
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="封面图">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            :on-change="onImageChange"
          >
            <el-button>选择图片</el-button>
          </el-upload>
          <span v-if="form.coverPath" class="text-xs text-gray-500 ml-2 truncate">{{ form.coverPath }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="预览图">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            :on-change="onPreviewChange"
          >
            <el-button>选择图片</el-button>
          </el-upload>
          <span v-if="form.previewPath" class="text-xs text-gray-500 ml-2 truncate">{{ form.previewPath }}</span>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="ZIP 文件">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            :limit="1"
            accept=".zip"
            :on-change="onZipChange"
          >
            <el-button>选择 ZIP 文件</el-button>
          </el-upload>
          <span v-if="form.downloadUrl" class="text-xs text-gray-500 ml-2 truncate">{{ form.downloadUrl }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="网盘链接">
          <el-input v-model="form.cloudDriveUrl" placeholder="备用下载链接" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="文件大小">
          <el-input-number v-model="form.fileSize" :min="0" :controls="false" class="w-full" placeholder="bytes" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="字数">
          <el-input-number v-model="form.glyphCount" :min="0" :controls="false" class="w-full" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" native-type="submit">{{ initial ? '保存' : '创建' }}</el-button>
      <el-button @click="$router.push('/fonts')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadFile } from 'element-plus';
import { adminApi } from '../utils/api.ts';
import { CATEGORIES, LANGUAGES } from '@shared/types/common.ts';
import type { Font, FontFormData, License } from '@shared/types/index.ts';

const WEIGHTS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];

const props = defineProps<{ initial?: Font }>();
const emit = defineEmits<{ submit: [data: FontFormData] }>();

const licenses = ref<License[]>([]);
const tagsInput = ref('');

const form = reactive<FontFormData>({
  slug: '',
  nameZh: '',
  nameEn: '',
  vendor: '',
  version: '',
  licenseId: '',
  description: '',
  content: '',
  category: '',
  officialUrl: '',
  coverPath: '',
  previewPath: '',
  sha256: '',
  downloadUrl: '',
  cloudDriveUrl: '',
  languages: [],
  formats: [],
  weights: [],
  tags: [],
});

onMounted(async () => {
  licenses.value = await adminApi.getLicenses();
  if (props.initial) {
    const f = props.initial;
    Object.assign(form, {
      slug: f.slug,
      nameZh: f.nameZh || '',
      nameEn: f.nameEn || '',
      vendor: f.vendor,
      version: f.version,
      licenseId: f.licenseId,
      description: f.description || '',
      content: f.content || '',
      category: f.category || '',
      officialUrl: f.officialUrl || '',
      coverPath: f.coverPath || '',
      previewPath: f.previewPath || '',
      sha256: f.sha256 || '',
      downloadUrl: f.downloadUrl || '',
      cloudDriveUrl: f.cloudDriveUrl || '',
      languages: [...f.languages],
      formats: [...f.formats],
      weights: [...f.weights],
      tags: [...f.tags],
    } as FontFormData);
    if (f.fileSize != null) form.fileSize = f.fileSize;
    if (f.glyphCount != null) form.glyphCount = f.glyphCount;
    tagsInput.value = f.tags.join(', ');
  }
});

async function onImageChange(file: UploadFile) {
  if (!file.raw) return;
  const result = await adminApi.uploadImage(file.raw);
  form.coverPath = result.url;
  ElMessage.success('封面图上传成功');
}

async function onPreviewChange(file: UploadFile) {
  if (!file.raw) return;
  const result = await adminApi.uploadImage(file.raw);
  form.previewPath = result.url;
  ElMessage.success('预览图上传成功');
}

async function onZipChange(file: UploadFile) {
  if (!file.raw) return;
  const result = await adminApi.uploadZip(file.raw, form.slug, form.version);
  form.downloadUrl = result.downloadUrls.githubRaw;
  form.sha256 = result.sha256;
  form.fileSize = result.fileSize;
  ElMessage.success('ZIP 文件上传成功');
}

function onSubmit() {
  form.tags = tagsInput.value.split(',').map((t) => t.trim()).filter(Boolean);
  emit('submit', { ...form });
}
</script>
