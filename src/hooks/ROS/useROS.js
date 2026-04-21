import { useContext } from "react"
import { RosContext } from "./ROSContext"

export function useRos() {
  return useContext(RosContext)
}