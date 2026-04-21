import { useContext } from "react"
import { RosContext } from "./RosContext"

export function useRos() {
  return useContext(RosContext)
}