"use client"

import { useEffect } from 'react'
import { useStore } from '../store'

export default function DataLoader() {
  const { loadInitialData } = useStore()

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  return null
}
