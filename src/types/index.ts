// 示例类型定义
export interface Example {
  id: string
  title: string
  description: string
  category: string
  component: React.ComponentType
}

// 分类配置（可选，用于自定义分类显示名称）
export interface CategoryConfig {
  label: string
  order?: number
}

