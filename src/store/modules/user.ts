import { Object as FabricObject } from 'fabric'
import { customAlphabet } from 'nanoid'
import { defineStore } from 'pinia'
import { SYS_FONTS } from '@/configs/fonts'
import { ImageCategoryInfo } from '@/configs/images'
import { getSupportFonts } from '@/utils/fonts'
import { CanvasElement } from '@/types/canvas'
import { RightStates, PointElement, ImageCategoryData } from '@/types/elements'
import { ExportTypes, PoolType, SystemFont } from '@/types/common'
import { getFontInfo } from '@/api/static/font'
import { FontInfo } from '@/api/static/types'
import useCanvas from '@/views/Canvas/useCanvas'

export interface UserState {
  id: number
  uuid: string
  username: string
  nickname: string
  phone: string
  avatar: string
  deptId: number
  email: string
  isMultiLogin: boolean
  isStaff: boolean
  isSuperuser: boolean
  joinTime: string
  lastLoginTime: string
  loginStatus: boolean
  token: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: 0,
    uuid: '',
    username: '',
    nickname: '',
    phone: '',
    avatar: '',
    deptId: 0,
    email: '',
    isMultiLogin: false,
    isStaff: false,
    isSuperuser: false,
    joinTime: '',
    lastLoginTime: '',
    loginStatus: false,
    token: ''
  }),

  getters: {
    activeElementList() {
    //   const slidesStore = useSlidesStore()
    //   const currentSlide = slidesStore.currentSlide
    //   if (!currentSlide || !currentSlide.elements) return []
    },
  
    
  },

  actions: {
    
    setLoginStatus(status: boolean) {
      this.loginStatus = status
    }
    
  },
})