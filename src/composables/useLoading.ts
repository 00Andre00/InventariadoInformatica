import { ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus'

export function useLoading() {
  let loadingInstance: LoadingInstance | null = null

  const startLoading = (options: any = {}) => {
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Cargando...',
      background: 'rgba(0, 0, 0, 0.7)',
      ...options
    })
  }

  const stopLoading = () => {
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }

  return {
    startLoading,
    stopLoading
  }
}