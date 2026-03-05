export function formatRelativeTime(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
    if (diffInSeconds < 60) {
      return "hace menos de un minuto"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `hace ${days} ${days === 1 ? "día" : "días"}`
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `hace ${months} ${months === 1 ? "mes" : "meses"}`
    } else {
      const years = Math.floor(diffInSeconds / 31536000)
      return `hace ${years} ${years === 1 ? "año" : "años"}`
    }
  }