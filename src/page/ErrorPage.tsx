import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>錯誤頁</h1>
      <p>發生錯誤或頁面不存在。</p>
      <p>
        <Link to="/index">回首頁</Link>
      </p>
    </div>
  )
} 