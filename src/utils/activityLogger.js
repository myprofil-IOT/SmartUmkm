
export const logActivity = (user, action) => {
  const logs = JSON.parse(localStorage.getItem("activityLogs")) || []

  const newLog = {
    id: Date.now(),
    user: user.username,
    role: user.role,
    action,
    time: new Date().toLocaleString()
  }

  logs.unshift(newLog) // terbaru di atas

  localStorage.setItem("activityLogs", JSON.stringify(logs))

  // trigger event supaya dashboard auto update
  window.dispatchEvent(new Event("activityUpdated"))
}