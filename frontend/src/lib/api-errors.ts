export function extractApiError(error: any): string {
  // 1. Timeout handling
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT" || error.message?.toLowerCase().includes("timeout")) {
    return "The request timed out. The analysis server took longer than expected to respond. Please try again."
  }

  // 2. Network or Server Unreachable / CORS Block
  if (!error.response || error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
    return "Unable to reach the analysis server. Please make sure the backend is running and accessible at the configured API URL."
  }

  const status = error.response.status
  const data = error.response.data

  // Extract message detail from FastAPI
  let detailMessage = ""
  if (data) {
    if (typeof data.detail === "string") {
      detailMessage = data.detail
    } else if (Array.isArray(data.detail)) {
      // FastAPI 422 validation array format: [{loc: [...], msg: "...", type: "..."}]
      detailMessage = data.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
    } else if (typeof data.message === "string") {
      detailMessage = data.message
    }
  }

  switch (status) {
    case 400:
      return detailMessage 
        ? detailMessage 
        : "Some of the analysis inputs are invalid. Please check your resume and job description."
    case 401:
      return "Please log in to continue."
    case 403:
      return "You do not have permission to perform this action."
    case 413:
      return detailMessage 
        ? detailMessage 
        : "File is too large. Maximum allowed size is 5MB."
    case 422:
      return detailMessage
        ? detailMessage
        : "The resume could not be processed. Please upload a valid text-based PDF or DOCX."
    case 429:
      return "Too many requests. Please try again shortly."
    case 500:
      return detailMessage && !detailMessage.includes("Traceback") && !detailMessage.includes("Error:")
        ? detailMessage
        : "Something went wrong while processing the analysis. Please try again."
    case 503:
      return detailMessage 
        ? detailMessage 
        : "The AI service is currently unavailable. Your technical analysis may still be available."
    default:
      return detailMessage || `An error occurred (Status ${status}). Please try again.`
  }
}
