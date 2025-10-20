'use client'

import api from "./api/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import InputText from "./src/login/defaultinput";
import { toast } from "sonner"; // 👈 importa o toast

export default function Home() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) router.push("/dashboard");
  }, [router]);

  const loginform = async () => {
    if (!name || !password) {
      toast.error("Preencha todos os campos!"); // 👈 toast de erro
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", name);
      formData.append("password", password);

      const { data } = await api.post<{ access_token: string }>("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      Cookies.set("token", data.access_token, { expires: 30, path: "/" });

      toast.success("Login realizado com sucesso! 🔓"); // 👈 toast de sucesso
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erro no login:", error.response?.data || error.message);
      toast.error("Usuário ou senha incorretos."); // 👈 toast de erro
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#1C1C1C]">
      
      {/* Coluna da logo + inputs */}
      <div className="w-full md:w-5/12 flex flex-col justify-center items-center p-6 bg-black z-10 overflow-auto">
        <Image 
          src="/login/Sesi_logo.png" 
          width={250} 
          height={194} 
          alt="sesilogo" 
          className="w-40 sm:w-56 md:w-64 lg:w-72 h-auto"
        />

        {/* Container dos inputs */}
        <div className="flex flex-col justify-center items-center w-full max-w-md mt-6 p-6 rounded-2xl shadow-lg max-h-[80vh] overflow-y-auto mb-15">
          <InputText holder="Login" value={name} onChange={(e: any) => setName(e.target.value)} />
          <InputText holder="Senha" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} />

          <button
            onClick={loginform}
            className="bg-[#0E4194] w-96 h-14 m-8 rounded-md text-white hover:bg-[#0B306C] hover:scale-105 transform transition-transform"
          >
            Logar
          </button>
        </div>
      </div>

      {/* Imagem de fundo responsiva */}
      <div className="relative w-full md:flex-1 h-[40vh] md:h-auto">
        <Image
          src="/login/bglogin.png"
          alt="Background Image"
          fill
          className="object-cover object-center opacity-60 md:opacity-100"
          priority
        />
      </div>
    </div>
  );
}
