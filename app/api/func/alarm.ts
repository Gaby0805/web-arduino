
import api from "../api"
import { toast } from "sonner"
async function deleteAlarm(id: number) {
  try {
    await api.delete(`/alarms/${id}`) // Combina com o endpoint do FastAPI
    console.log("Alarme deletado com sucesso")
  } catch (error) {
    console.error("Erro ao deletar alarme:", error)
    return (
          toast('erro ao deletar')

    )
  }
}
// Atualizar status (PATCH direto em /alarms/{id}/)
async function updateStatus(id: number, is_active: boolean) {
  try {
    await api.patch(`/alarms/${id}/`, { is_active }) // precisa existir @router.patch("/{alarm_id}/") no FastAPI
    console.log("Status do alarme atualizado com sucesso")
    toast("Status atualizado com sucesso")
  } catch (error: any) {
    console.error("Erro ao atualizar status do alarme:", error)
    toast("Erro ao atualizar status")
  }
}

export { deleteAlarm, updateStatus }