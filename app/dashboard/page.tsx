'use client'
// @ts-nocheck

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { updateStatus, deleteAlarm } from '../api/func/alarm'
import api from '../api/api'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type AlarmApi = {
  id: number
  label: string
  time: string
  is_active: boolean
  days: number[]
  user_id: number
}

type Alarm = {
  id: number
  nome: string
  horario: string
  ativo: boolean
  dia: number[]
}

export default function Dashboard() {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [nome, setNome] = useState('')
  const [horario, setHorario] = useState('')

  // Criar alarme avançado
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [alarmActive, setAlarmActive] = useState('true')
  const [dayOfWeek, setDayOfWeek] = useState<string[]>([]) // ← agora é array

  // Buscar alarmes do banco
  const fetchAlarms = async () => {
    try {
      const { data } = await api.get<AlarmApi[]>('/alarms')
      const mapped: Alarm[] = (Array.isArray(data) ? data : []).map((a) => ({
        id: a.id,
        nome: a.label,
        horario: a.time?.slice(0, 5) ?? '',
        ativo: a.is_active,
        dia: a.days ?? [],
      }))
      setAlarms(mapped)
    } catch (error) {
      console.error('Erro ao buscar alarmes', error)
      toast('Erro ao buscar alarmes')
    }
  }

  useEffect(() => {
    fetchAlarms()
  }, [])

  const Activate = async () => {
    try {
      await api.post('socket/disparar-alarme')
      toast('Alarme ativado com sucesso!')
    } catch (error) {
      console.error('Erro ao ativar alarme:', error)
      toast('Erro ao ativar alarme')
    }
  }

  // Criar alarme avançado com múltiplos dias
  const handleCreateAlarmAdvanced = async () => {
    if (!name || !time || dayOfWeek.length === 0)
      return toast('Preencha todos os campos!')

    try {
      const payload = {
        label: name,
        time: time + ':00',
        is_active: alarmActive === 'true',
        days: dayOfWeek.map((d) => parseInt(d)),
        user_id: 1,
      }

      const { data } = await api.post<AlarmApi>('/alarms', payload)
      setAlarms((prev) => [
        ...prev,
        {
          id: data.id,
          nome: data.label,
          horario: data.time.slice(0, 5),
          ativo: data.is_active,
          dia: data.days ?? [],
        },
      ])
      setName('')
      setTime('')
      setDayOfWeek([])
      toast('Alarme criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar alarme:', error)
      toast('Erro ao criar alarme')
    }
  }

  const handleToggle = async (id: number, value: boolean) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ativo: value } : a))
    )
    try {
      await updateStatus(id, value)
      toast('Status atualizado com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      setAlarms((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ativo: !value } : a))
      )
      toast('Erro ao atualizar status')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteAlarm(id)
      setAlarms((prev) => prev.filter((a) => a.id !== id))
      toast('Alarme deletado com sucesso')
    } catch (error) {
      console.error('Erro ao deletar alarme:', error)
      toast('Erro ao deletar alarme')
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#121212] text-white p-4">
      {/* Sidebar */}
      <div className="flex flex-col items-center justify-between md:w-1/5 bg-black p-6 rounded-2xl">
        <Image
          src="/login/Sesi_logo.png"
          alt="SESI logo"
          width={150}
          height={100}
          className="object-contain"
        />
        <button
          onClick={Activate}
          className="bg-[#0E4194] text-white px-10 py-3 rounded-lg mt-8 hover:bg-[#0B306C] transition-transform hover:scale-105"
        >
          Ativar
        </button>
      </div>

      {/* Tabela de alarmes */}
      <div className="flex flex-col items-center justify-center w-full md:w-2/5 p-6">
        <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="bg-[#2C2C2C] text-gray-300">
              <th className="py-2 px-3 text-left">Nome</th>
              <th className="py-2 px-3 text-left">Horário</th>
              <th className="py-2 px-3 text-left">Dia da semana</th>
              <th className="py-2 px-3 text-left">Ativo</th>
              <th className="py-2 px-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((alarm) => (
              <tr key={alarm.id} className="border-t border-gray-700">
                <td className="py-2 px-3">{alarm.nome}</td>
                <td className="py-2 px-3">{alarm.horario}</td>
                <td className="py-2 px-3">
                  {alarm.dia.length > 0
                    ? alarm.dia
                        .map(
                          (d) =>
                            [
                              'Segunda',
                              'Terça',
                              'Quarta',
                              'Quinta',
                              'Sexta',
                              'Sábado',
                              'Domingo',
                            ][d]
                        )
                        .join(', ')
                    : '—'}
                </td>
                <td className="py-2 px-3">
                  <input
                    type="checkbox"
                    checked={alarm.ativo}
                    onChange={(e) => handleToggle(alarm.id, e.target.checked)}
                  />
                </td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => handleDelete(alarm.id)}
                    className="text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Criar alarmes simples e avançados */}
      <div className="flex flex-col justify-center w-full md:w-1/3 bg-[#1E1E1E] p-6 rounded-xl shadow-md mt-6 md:mt-0">
        <h2 className="text-lg font-semibold mb-4">Criar alarme</h2>

        <input
          type="text"
          placeholder="Nome do horário"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#2C2C2C] text-white rounded-md p-2 mb-3 w-full outline-none"
        />
        <input
          type="time"
          placeholder="Horário"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-[#2C2C2C] text-white rounded-md p-2 mb-3 w-full outline-none"
        />

        <select
          value={alarmActive}
          onChange={(e) => setAlarmActive(e.target.value)}
          className="bg-[#2C2C2C] text-white rounded-md p-2 mb-3 w-full outline-none"
        >
          <option value="true">Ativado</option>
          <option value="false">Desativado</option>
        </select>

        {/* ✅ Checkboxes para vários dias da semana */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-300">Dias da semana:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Segunda',
              'Terça',
              'Quarta',
              'Quinta',
              'Sexta',
              'Sábado',
              'Domingo',
            ].map((dia, index) => (
              <label key={index} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={dayOfWeek.includes(index.toString())}
                  onChange={(e) => {
                    setDayOfWeek((prev) => {
                      if (e.target.checked) {
                        return [...prev, index.toString()]
                      } else {
                        return prev.filter((d) => d !== index.toString())
                      }
                    })
                  }}
                />
                {dia}
              </label>
            ))}
          </div>
        </div>

        <Button onClick={handleCreateAlarmAdvanced}>Criar</Button>
      </div>
    </div>
  )
}
