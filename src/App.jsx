import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'
import { 
  Mail, 
  Lock, 
  User, 
  Sun, 
  Moon, 
  LogOut, 
  AlertCircle, 
  CheckCircle,
  Eye,
  EyeOff,
  Apple,
  Users,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Activity
} from 'lucide-react'

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
  return (
    <button 
      className={`${baseClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

function App() {
  const [theme, setTheme] = useState('light')
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('login') // 'login' | 'register' | 'app'
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'pacientes'
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  
  // Dashboard Metrics & Data
  const [totalPatients, setTotalPatients] = useState(0)
  const [weekConsultations, setWeekConsultations] = useState(0)
  const [patientsNoReturn, setPatientsNoReturn] = useState([])
  const [loadingDashboard, setLoadingDashboard] = useState(false)

  // Pacientes List & Form (for future prompt but integrated basic structure)
  const [patientsList, setPatientsList] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [lastConsultations, setLastConsultations] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingPatient, setIsAddingPatient] = useState(false)
  const [isEditingPatientId, setIsEditingPatientId] = useState(null)
  const [activeFormTab, setActiveFormTab] = useState('pessoal') // 'pessoal' | 'clinico' | 'habitos'

  // Patient Form States
  const [pNome, setPNome] = useState('')
  const [pNascimento, setPNascimento] = useState('')
  const [pSexo, setPSexo] = useState('Feminino')
  const [pTelefone, setPTelefone] = useState('')
  const [pWhatsapp, setPWhatsapp] = useState('')
  const [pEmail, setPEmail] = useState('')
  
  const [pPeso, setPPeso] = useState('')
  const [pAltura, setPAltura] = useState('')
  const [pObjetivos, setPObjetivos] = useState([])
  const [pObjetivoTexto, setPObjetivoTexto] = useState('')
  const [pNivelAtividade, setPNivelAtividade] = useState('Sedentário')
  const [pPatologias, setPPatologias] = useState([])
  const [pPatologiaLivre, setPPatologiaLivre] = useState('')
  const [pRestricoes, setPRestricoes] = useState([])
  const [pRestricaoLivre, setPRestricaoLivre] = useState('')
  const [pAlergias, setPAlergias] = useState([])
  const [pAlergiaLivre, setPAlergiaLivre] = useState('')
  const [pMedicamentos, setPMedicamentos] = useState('')
  const [pSuplementos, setPSuplementos] = useState('')
  
  const [pRefeicoesDia, setPRefeicoesDia] = useState('')
  const [pHorarioAcorda, setPHorarioAcorda] = useState('')
  const [pHorarioDorme, setPHorarioDorme] = useState('')
  const [pLitrosAgua, setPLitrosAgua] = useState('')
  const [pAtividadeFisica, setPAtividadeFisica] = useState(false)
  const [pAtividadeFisicaDesc, setPAtividadeFisicaDesc] = useState('')
  // Profile View Tab & Editable Fields
  const [profileActiveTab, setProfileActiveTab] = useState('pessoal')
  const [epNome, setEpNome] = useState('')
  const [epNascimento, setEpNascimento] = useState('')
  const [epSexo, setEpSexo] = useState('Feminino')
  const [epTelefone, setEpTelefone] = useState('')
  const [epWhatsapp, setEpWhatsapp] = useState('')
  const [epEmail, setEpEmail] = useState('')
  
  const [epPeso, setEpPeso] = useState('')
  const [epAltura, setEpAltura] = useState('')
  const [epObjetivos, setEpObjetivos] = useState([])
  const [epObjetivoTexto, setEpObjetivoTexto] = useState('')
  const [epNivelAtividade, setEpNivelAtividade] = useState('Sedentário')
  const [epPatologias, setEpPatologias] = useState([])
  const [epPatologiaLivre, setEpPatologiaLivre] = useState('')
  const [epRestricoes, setEpRestricoes] = useState([])
  const [epRestricaoLivre, setEpRestricaoLivre] = useState('')
  const [epAlergias, setEpAlergias] = useState([])
  const [epAlergiaLivre, setEpAlergiaLivre] = useState('')
  const [epMedicamentos, setEpMedicamentos] = useState('')
  const [epSuplementos, setEpSuplementos] = useState('')
  
  const [epRefeicoesDia, setEpRefeicoesDia] = useState('')
  const [epHorarioAcorda, setEpHorarioAcorda] = useState('')
  const [epHorarioDorme, setEpHorarioDorme] = useState('')
  const [epLitrosAgua, setEpLitrosAgua] = useState('')
  const [epAtividadeFisica, setEpAtividadeFisica] = useState(false)
  const [epAtividadeFisicaDesc, setEpAtividadeFisicaDesc] = useState('')
  const [epObservacoes, setEpObservacoes] = useState('')

  // Consultations & Plans states
  const [consultationsList, setConsultationsList] = useState([])
  const [loadingConsultations, setLoadingConsultations] = useState(false)
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  
  const [plansList, setPlansList] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  // Consultation Form States
  const [cData, setCData] = useState(new Date().toISOString().split('T')[0])
  const [cPeso, setCPeso] = useState('')
  const [cCintura, setCCintura] = useState('')
  const [cQuadril, setCQuadril] = useState('')
  const [cGordura, setCGordura] = useState('')
  const [cObservacoes, setCObservacoes] = useState('')
  const [cProximoRetorno, setCProximoRetorno] = useState('')

  // Form states (Auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Sync theme with document attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Initialize Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        setView('app')
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession)
      if (currentSession) {
        setView('app')
      } else if (event === 'SIGNED_OUT') {
        setView('login')
        setSelectedPatientId(null)
        setActiveTab('dashboard')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load dashboard data when view is app and session is present
  useEffect(() => {
    if (view === 'app' && session) {
      loadDashboardData()
      loadPatientsData()
    }
  }, [view, session])

  // Load consultations and food plans when a patient profile is selected
  useEffect(() => {
    if (selectedPatientId) {
      loadPatientDetails(selectedPatientId)
    }
  }, [selectedPatientId, loadPatientDetails])

  const loadPatientDetails = useCallback(async (patientId) => {
    setErrorMsg('')
    setSuccessMsg('')
    // Find patient and set edit form states
    const patient = patientsList.find(p => p.id === patientId)
    if (patient) {
      setEpNome(patient.nome || '')
      setEpNascimento(patient.data_nascimento || '')
      setEpSexo(patient.sexo || 'Feminino')
      setEpTelefone(patient.telefone || '')
      setEpWhatsapp(patient.whatsapp || '')
      setEpEmail(patient.email || '')
      
      setEpPeso(patient.peso_inicial || '')
      setEpAltura(patient.altura || '')
      setEpObjetivos(patient.objetivos || [])
      setEpObjetivoTexto(patient.objetivo_texto || '')
      setEpNivelAtividade(patient.nivel_atividade || 'Sedentário')
      setEpPatologias(patient.patologias || [])
      setEpPatologiaLivre('')
      setEpRestricoes(patient.restricoes_alimentares || [])
      setEpRestricaoLivre('')
      setEpAlergias(patient.alergias || [])
      setEpAlergiaLivre('')
      setEpMedicamentos(patient.medicamentos || '')
      setEpSuplementos(patient.suplementos || '')
      
      setEpRefeicoesDia(patient.refeicoes_por_dia || '')
      setEpHorarioAcorda(patient.horario_acorda || '')
      setEpHorarioDorme(patient.horario_dorme || '')
      setEpLitrosAgua(patient.litros_agua || '')
      setEpAtividadeFisica(patient.atividade_fisica || false)
      setEpAtividadeFisicaDesc(patient.atividade_fisica_descricao || '')
      setEpObservacoes(patient.observacoes || '')
    }

    // Fetch consultations
    setLoadingConsultations(true)
    try {
      const { data, error } = await supabase
        .from('consultas')
        .select('*')
        .eq('paciente_id', patientId)
        .order('data_consulta', { ascending: false })
      if (error) throw error
      setConsultationsList(data || [])
    } catch (err) {
      console.error('Erro ao carregar consultas:', err)
    } finally {
      setLoadingConsultations(false)
    }

    // Fetch food plans
    setLoadingPlans(true)
    try {
      const { data, error } = await supabase
        .from('planos_alimentares')
        .select('*')
        .eq('paciente_id', patientId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setPlansList(data || [])
    } catch (err) {
      console.error('Erro ao carregar planos alimentares:', err)
    } finally {
      setLoadingPlans(false)
    }
  }, [patientsList])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  const switchView = (newView) => {
    setErrorMsg('')
    setSuccessMsg('')
    setEmail('')
    setPassword('')
    setNome('')
    setConfirmPassword('')
    setView(newView)
  }

  // Load Dashboard Stats & No Return Patients List
  const loadDashboardData = async () => {
    setLoadingDashboard(true)
    try {
      // 1. Total Patients
      const { count: countPatients, error: errorPatients } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true })
      
      if (errorPatients) throw errorPatients
      setTotalPatients(countPatients || 0)

      // 2. Consultations of the current week (Monday to Sunday)
      const now = new Date()
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust if Sunday
      const startOfWeek = new Date(now.setDate(diff))
      startOfWeek.setHours(0,0,0,0)
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      endOfWeek.setHours(23,59,59,999)
      
      const startStr = startOfWeek.toISOString().split('T')[0]
      const endStr = endOfWeek.toISOString().split('T')[0]

      const { count: countConsults, error: errorConsults } = await supabase
        .from('consultas')
        .select('*', { count: 'exact', head: true })
        .gte('data_consulta', startStr)
        .lte('data_consulta', endStr)

      if (errorConsults) throw errorConsults
      setWeekConsultations(countConsults || 0)

      // 3. Patients without return (>30 days since last consultation and no future scheduled return)
      const { data: patients, error: pError } = await supabase
        .from('pacientes')
        .select('id, nome, email, whatsapp')
      if (pError) throw pError

      const { data: consultations, error: cError } = await supabase
        .from('consultas')
        .select('paciente_id, data_consulta, proximo_retorno')
        .order('data_consulta', { ascending: false })
      if (cError) throw cError

      const today = new Date()
      today.setHours(0,0,0,0)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      thirtyDaysAgo.setHours(0,0,0,0)

      const noReturnList = []

      patients.forEach(p => {
        const pConsults = consultations.filter(c => c.paciente_id === p.id)
        if (pConsults.length > 0) {
          const latestConsult = pConsults[0] // since sorted desc
          const lastDate = new Date(latestConsult.data_consulta)
          
          if (lastDate < thirtyDaysAgo) {
            const hasFutureReturn = pConsults.some(c => {
              if (!c.proximo_retorno) return false
              const retDate = new Date(c.proximo_retorno)
              return retDate >= today
            })

            if (!hasFutureReturn) {
              const daysSince = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
              noReturnList.push({
                id: p.id,
                nome: p.nome,
                email: p.email,
                whatsapp: p.whatsapp,
                last_date: latestConsult.data_consulta,
                days_since: daysSince
              })
            }
          }
        }
      })

      setPatientsNoReturn(noReturnList)
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err)
    } finally {
      setLoadingDashboard(false)
    }
  }

  // Load full patients list
  const loadPatientsData = async () => {
    setLoadingPatients(true)
    try {
      const { data: patients, error: errorPatients } = await supabase
        .from('pacientes')
        .select('*')
        .order('nome', { ascending: true })
      
      if (errorPatients) throw errorPatients
      setPatientsList(patients || [])

      // Fetch consultations to map last consultation date
      const { data: consultations, error: errorConsultations } = await supabase
        .from('consultas')
        .select('paciente_id, data_consulta')
        .order('data_consulta', { ascending: false })
      
      if (!errorConsultations && consultations) {
        const mapping = {}
        consultations.forEach(c => {
          if (!mapping[c.paciente_id]) {
            mapping[c.paciente_id] = c.data_consulta
          }
        })
        setLastConsultations(mapping)
      }
    } catch (err) {
      console.error('Erro ao carregar pacientes:', err)
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!nome.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.')
      return
    }
    if (password.length < 6) {
      setErrorMsg('A senha deve conter no mínimo 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.')
      return
    }

    setActionLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome,
            name: nome,
            displayName: nome,
          }
        }
      })

      if (error) throw error

      if (data?.user) {
        if (data.session) {
          setSuccessMsg('Cadastro realizado com sucesso!')
          setSession(data.session)
          setView('app')
        } else {
          setSuccessMsg('Cadastro realizado! Por favor, verifique sua caixa de e-mail para confirmar a conta.')
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Ocorreu um erro ao tentar criar a conta. Tente novamente.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email || !password) {
      setErrorMsg('Preencha todos os campos.')
      return
    }

    setActionLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data?.session) {
        setSession(data.session)
        setView('app')
      }
    } catch (err) {
      let msg = err.message
      if (msg === 'Invalid login credentials') {
        msg = 'E-mail ou senha incorretos. Por favor, tente novamente.'
      } else if (msg === 'Email not confirmed') {
        msg = 'O e-mail ainda não foi confirmado. Verifique sua caixa de entrada.'
      }
      setErrorMsg(msg)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Erro ao sair:', err)
    } finally {
      setSession(null)
      setView('login')
      setSelectedPatientId(null)
      setActiveTab('dashboard')
      setLoading(false)
    }
  }

  const formatLocalDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  if (loading) {
    return (
      <div className="auth-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Apple className="logo-icon" size={48} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Carregando sistema...</p>
      </div>
    )
  }

  // Render a specific patient profile
  const renderPatientProfile = (patientId) => {
    const patient = patientsList.find(p => p.id === patientId)
    if (!patient) return null

    // SVG Weight evolution chart builder
    const renderWeightChart = () => {
      if (consultationsList.length === 0) {
        return (
          <div style={{
            height: '180px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem'
          }}>
            Nenhuma consulta registrada ainda.
          </div>
        )
      }

      const chartData = [...consultationsList].reverse()
      const weights = chartData.map(c => c.peso)
      const minWeight = Math.max(0, Math.min(...weights) - 2)
      const maxWeight = Math.max(...weights) + 2
      const weightRange = maxWeight - minWeight === 0 ? 1 : maxWeight - minWeight

      const width = 500
      const height = 180
      const paddingLeft = 40
      const paddingRight = 20
      const paddingTop = 20
      const paddingBottom = 30

      const getX = (index) => {
        if (chartData.length <= 1) return paddingLeft + (width - paddingLeft - paddingRight) / 2
        return paddingLeft + (index / (chartData.length - 1)) * (width - paddingLeft - paddingRight)
      }

      const getY = (weight) => {
        return height - paddingBottom - ((weight - minWeight) / weightRange) * (height - paddingTop - paddingBottom)
      }

      let pathD = ''
      chartData.forEach((c, idx) => {
        const x = getX(idx)
        const y = getY(c.peso)
        if (idx === 0) {
          pathD += `M ${x} ${y}`
        } else {
          pathD += ` L ${x} ${y}`
        }
      })

      return (
        <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>Evolução de Peso (kg)</h4>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
              const w = minWeight + p * weightRange
              const y = getY(w)
              return (
                <g key={idx}>
                  <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
                  <text x={paddingLeft - 8} y={y + 4} fill="var(--text-secondary)" fontSize="10" textAnchor="end">{w.toFixed(1)}</text>
                </g>
              )
            })}

            {chartData.length > 1 && (
              <path d={pathD} fill="none" stroke="var(--primary-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            )}

            {chartData.map((c, idx) => {
              const x = getX(idx)
              const y = getY(c.peso)
              const dateStr = formatLocalDate(c.data_consulta).substring(0, 5)
              return (
                <g key={c.id}>
                  <circle cx={x} cy={y} r="5" fill="var(--bg-card)" stroke="var(--primary-color)" strokeWidth="3" />
                  <text x={x} y={y - 10} fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">{c.peso} kg</text>
                  <text x={x} y={height - 8} fill="var(--text-secondary)" fontSize="9" textAnchor="middle">{dateStr}</text>
                </g>
              )
            })}
          </svg>
        </div>
      )
    }

    return (
      <div style={{ animation: 'slideIn 0.3s ease-out' }}>
        <Button 
          onClick={() => setSelectedPatientId(null)} 
          variant="secondary" 
          style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Section 1: Dados do Paciente */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
              <User size={20} /> Ficha e Cadastro do Paciente
            </h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Cadastrado em {formatLocalDate(patient.created_at?.split('T')[0])}
            </span>
          </div>

          <form onSubmit={handleUpdatePatientDetails}>
            {/* Tab Navigation */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto' }}>
              {['pessoal', 'clinico', 'habitos'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setProfileActiveTab(tab)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: profileActiveTab === tab ? '3px solid var(--primary-color)' : '3px solid transparent',
                    color: profileActiveTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab === 'pessoal' ? 'Pessoal' : tab === 'clinico' ? 'Clínico' : 'Hábitos'}
                </button>
              ))}
            </div>

            {/* Tab 1: Pessoal */}
            {profileActiveTab === 'pessoal' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Nome Completo *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={epNome} 
                    onChange={(e) => setEpNome(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Data de Nascimento</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={epNascimento} 
                    onChange={(e) => setEpNascimento(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sexo</label>
                  <select 
                    className="form-input" 
                    value={epSexo} 
                    onChange={(e) => setEpSexo(e.target.value)}
                  >
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="(00) 0000-0000" 
                    value={epTelefone} 
                    onChange={(e) => setEpTelefone(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="(00) 90000-0000" 
                    value={epWhatsapp} 
                    onChange={(e) => setEpWhatsapp(e.target.value)} 
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">E-mail</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="email@exemplo.com" 
                    value={epEmail} 
                    onChange={(e) => setEpEmail(e.target.value)} 
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Clínico */}
            {profileActiveTab === 'clinico' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Peso Inicial (kg)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-input" 
                    placeholder="Ex: 75.5" 
                    value={epPeso} 
                    onChange={(e) => setEpPeso(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Altura (cm)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Ex: 175" 
                    value={epAltura} 
                    onChange={(e) => setEpAltura(e.target.value)} 
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Nível de Atividade Física</label>
                  <select 
                    className="form-input" 
                    value={epNivelAtividade} 
                    onChange={(e) => setEpNivelAtividade(e.target.value)}
                  >
                    <option value="Sedentário">Sedentário (pouco ou nenhum exercício)</option>
                    <option value="Moderadamente ativo">Moderadamente ativo (exercício 3-5x/semana)</option>
                    <option value="Muito ativo">Muito ativo (exercício diário ou intenso)</option>
                  </select>
                </div>

                {/* Objectives */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Objetivos Principais</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {['Emagrecimento', 'Hipertrofia', 'Saúde', 'Performance'].map(obj => (
                      <button
                        key={obj}
                        type="button"
                        onClick={() => handleArrayToggle(obj, epObjetivos, setEpObjetivos)}
                        className={`badge ${epObjetivos.includes(obj) ? 'badge-primary' : 'badge-outline'}`}
                      >
                        {obj}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    style={{ marginTop: '0.75rem' }} 
                    className="form-input" 
                    placeholder="Outro objetivo específico..." 
                    value={epObjetivoTexto} 
                    onChange={(e) => setEpObjetivoTexto(e.target.value)} 
                  />
                </div>

                {/* Patologias */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Patologias / Condições Médicas</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {['Hipertensão', 'Diabetes', 'Gastrite', 'Colesterol Alto', 'Nenhum'].map(pat => (
                      <button
                        key={pat}
                        type="button"
                        onClick={() => handleArrayToggle(pat, epPatologias, setEpPatologias)}
                        className={`badge ${epPatologias.includes(pat) ? 'badge-primary' : 'badge-outline'}`}
                      >
                        {pat}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Outra patologia..." 
                      value={epPatologiaLivre} 
                      onChange={(e) => setEpPatologiaLivre(e.target.value)} 
                    />
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={() => handleAddLivre(epPatologiaLivre, epPatologias, setEpPatologias, setEpPatologiaLivre)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Restrições */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Restrições Alimentares</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {['Glúten', 'Lactose', 'Vegano', 'Vegetariano', 'Nenhum'].map(res => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => handleArrayToggle(res, epRestricoes, setEpRestricoes)}
                        className={`badge ${epRestricoes.includes(res) ? 'badge-primary' : 'badge-outline'}`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Outra restrição..." 
                      value={epRestricaoLivre} 
                      onChange={(e) => setEpRestricaoLivre(e.target.value)} 
                    />
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={() => handleAddLivre(epRestricaoLivre, epRestricoes, setEpRestricoes, setEpRestricaoLivre)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Alergias */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Alergias Alimentares</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {['Amendoim', 'Frutos do Mar', 'Ovo', 'Soja', 'Nenhum'].map(al => (
                      <button
                        key={al}
                        type="button"
                        onClick={() => handleArrayToggle(al, epAlergias, setEpAlergias)}
                        className={`badge ${epAlergias.includes(al) ? 'badge-primary' : 'badge-outline'}`}
                      >
                        {al}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Outra alergia..." 
                      value={epAlergiaLivre} 
                      onChange={(e) => setEpAlergiaLivre(e.target.value)} 
                    />
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={() => handleAddLivre(epAlergiaLivre, epAlergias, setEpAlergias, setEpAlergiaLivre)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Medicamentos Contínuos</label>
                  <textarea 
                    className="form-input" 
                    placeholder="Medicamentos de uso contínuo" 
                    value={epMedicamentos} 
                    onChange={(e) => setEpMedicamentos(e.target.value)} 
                    rows={2} 
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Suplementos em Uso</label>
                  <textarea 
                    className="form-input" 
                    placeholder="Suplementos ou vitaminas em uso" 
                    value={epSuplementos} 
                    onChange={(e) => setEpSuplementos(e.target.value)} 
                    rows={2} 
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Hábitos */}
            {profileActiveTab === 'habitos' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Refeições/dia</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={epRefeicoesDia} 
                      onChange={(e) => setEpRefeicoesDia(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Horário Acorda</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: 07:00" 
                      value={epHorarioAcorda} 
                      onChange={(e) => setEpHorarioAcorda(e.target.value)}
                      onBlur={(e) => handleTimeBlur(e.target.value, setEpHorarioAcorda)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Horário Dorme</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: 23:00" 
                      value={epHorarioDorme} 
                      onChange={(e) => setEpHorarioDorme(e.target.value)}
                      onBlur={(e) => handleTimeBlur(e.target.value, setEpHorarioDorme)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Consumo de Água (litros/dia)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-input" 
                    placeholder="Ex: 2.5" 
                    value={epLitrosAgua} 
                    onChange={(e) => setEpLitrosAgua(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={epAtividadeFisica} 
                      onChange={() => setEpAtividadeFisica(!epAtividadeFisica)} 
                    />
                    Pratica atividade física?
                  </label>
                  
                  {epAtividadeFisica && (
                    <div style={{ marginTop: '0.75rem', animation: 'slideIn 0.2s ease-out' }}>
                      <label className="form-label">Descrição e Frequência</label>
                      <textarea 
                        className="form-input" 
                        placeholder="Qual atividade e frequência semanal? Ex: Corrida 3x/semana" 
                        value={epAtividadeFisicaDesc} 
                        onChange={(e) => setEpAtividadeFisicaDesc(e.target.value)} 
                        rows={2} 
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Observações Gerais</label>
                  <textarea 
                    className="form-input" 
                    placeholder="Observações complementares" 
                    value={epObservacoes} 
                    onChange={(e) => setEpObservacoes(e.target.value)} 
                    rows={3} 
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>

        {/* Section 2: Consultas */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
              <Activity size={20} /> Acompanhamento e Consultas
            </h3>
            <Button onClick={() => setShowConsultationModal(true)}>
              Nova Consulta
            </Button>
          </div>

          {/* SVG Evolution Chart */}
          {renderWeightChart()}

          {/* Consultations List */}
          {loadingConsultations ? (
            <p style={{ color: 'var(--text-secondary)' }}>Carregando consultas...</p>
          ) : consultationsList.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Nenhuma consulta registrada ainda.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Data</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Peso (kg)</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Cintura (cm)</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Quadril (cm)</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>% Gordura</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Obs.</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Retorno</th>
                  </tr>
                </thead>
                <tbody>
                  {consultationsList.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{formatLocalDate(c.data_consulta)}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{c.peso} kg</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{c.cintura ? `${c.cintura} cm` : '-'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{c.quadril ? `${c.quadril} cm` : '-'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{c.percentual_gordura ? `${c.percentual_gordura}%` : '-'}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.observacoes}>
                        {c.observacoes || '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--primary-color)', fontWeight: 500 }}>
                        {c.proximo_retorno ? formatLocalDate(c.proximo_retorno) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 3: Planos Alimentares */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
              <Apple size={20} /> Planos Alimentares
            </h3>
            <Button disabled style={{ opacity: 0.6 }}>Gerar Plano Alimentar</Button>
          </div>

          {loadingPlans ? (
            <p style={{ color: 'var(--text-secondary)' }}>Carregando histórico de planos...</p>
          ) : plansList.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Nenhum plano alimentar gerado ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {plansList.map(plan => (
                <div key={plan.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}>
                    <span style={{ fontWeight: 600 }}>Plano Alimentar - Gerado em {formatLocalDate(plan.created_at?.split('T')[0])}</span>
                    <Button variant="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                      {selectedPlan?.id === plan.id ? 'Fechar' : 'Visualizar'}
                    </Button>
                  </div>
                  {selectedPlan?.id === plan.id && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem', backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                      {typeof plan.plano === 'object' ? JSON.stringify(plan.plano, null, 2) : plan.plano}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Nova Consulta */}
        {showConsultationModal && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              width: '90%',
              maxWidth: '500px',
              boxShadow: 'var(--shadow-lg)',
              animation: 'scaleIn 0.2s ease-out',
              color: 'var(--text-primary)'
            }}>
              <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 700, fontSize: '1.25rem' }}>Registrar Nova Consulta</h3>
              <form onSubmit={handleSaveConsultation}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Data da Consulta *</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      required 
                      value={cData} 
                      onChange={(e) => setCData(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Peso Atual (kg) *</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="form-input" 
                      required 
                      placeholder="Ex: 78.4"
                      value={cPeso} 
                      onChange={(e) => setCPeso(e.target.value)} 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Cintura (cm)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        className="form-input" 
                        placeholder="Ex: 85"
                        value={cCintura} 
                        onChange={(e) => setCCintura(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quadril (cm)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        className="form-input" 
                        placeholder="Ex: 98"
                        value={cQuadril} 
                        onChange={(e) => setCQuadril(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">% Gordura</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        className="form-input" 
                        placeholder="Ex: 18.5"
                        value={cGordura} 
                        onChange={(e) => setCGordura(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Observações</label>
                    <textarea 
                      className="form-input" 
                      placeholder="Evolução, dificuldades, queixas, etc..."
                      rows={3} 
                      value={cObservacoes} 
                      onChange={(e) => setCObservacoes(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Próxima Consulta (Retorno)</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={cProximoRetorno} 
                      onChange={(e) => setCProximoRetorno(e.target.value)} 
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setShowConsultationModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Salvando...' : 'Salvar Consulta'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }
  // Helper Calculations
  const calculateAge = (dob) => {
    if (!dob) return ''
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age >= 0 ? `${age} anos` : ''
  }

  const calculateIMC = (weight, height) => {
    if (!weight || !height) return ''
    const w = parseFloat(weight)
    const h = parseFloat(height) / 100 // cm to m
    if (isNaN(w) || isNaN(h) || h === 0) return ''
    const imc = w / (h * h)
    return imc.toFixed(1)
  }

  const handleTimeBlur = (value, setter) => {
    if (!value) return
    const clean = value.replace(/\D/g, '')
    if (clean.length === 0) return
    let hours = 0
    let minutes = 0
    if (clean.length <= 2) {
      hours = parseInt(clean)
    } else {
      hours = parseInt(clean.substring(0, clean.length - 2))
      minutes = parseInt(clean.substring(clean.length - 2))
    }
    if (isNaN(hours) || hours < 0 || hours > 23) hours = 0
    if (isNaN(minutes) || minutes < 0 || minutes > 59) minutes = 0
    
    const hStr = hours.toString().padStart(2, '0')
    const mStr = minutes.toString().padStart(2, '0')
    setter(`${hStr}:${mStr}`)
  }

  const handleArrayToggle = (item, array, setter) => {
    if (item === 'Nenhum') {
      setter(['Nenhum'])
      return
    }
    let newArray = array.filter(x => x !== 'Nenhum')
    if (newArray.includes(item)) {
      newArray = newArray.filter(x => x !== item)
    } else {
      newArray.push(item)
    }
    setter(newArray)
  }

  const handleAddLivre = (val, array, setter, clearInputSetter) => {
    if (!val.trim()) return
    const newArray = array.filter(x => x !== 'Nenhum')
    if (!newArray.includes(val.trim())) {
      newArray.push(val.trim())
    }
    setter(newArray)
    clearInputSetter('')
  }

  // Handle saving new patient
  const handleSavePatient = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setActionLoading(true)

    if (!pNome.trim()) {
      setErrorMsg('O nome completo é obrigatório.')
      setActionLoading(false)
      return
    }

    try {
      const patientData = {
        nutricionista_id: session.user.id,
        nome: pNome.trim(),
        data_nascimento: pNascimento || null,
        sexo: pSexo,
        whatsapp: pWhatsapp || null,
        email: pEmail || null,
        peso_inicial: pPeso ? parseFloat(pPeso) : null,
        altura: pAltura ? parseFloat(pAltura) : null,
        objetivos: pObjetivos,
        objetivo_texto: pObjetivoTexto || null,
        nivel_atividade: pNivelAtividade,
        patologias: pPatologias,
        restricoes_alimentares: pRestricoes,
        alergias: pAlergias,
        medicamentos: pMedicamentos || null,
        suplementos: pSuplementos || null,
        refeicoes_por_dia: pRefeicoesDia ? parseInt(pRefeicoesDia) : null,
        horario_acorda: pHorarioAcorda || null,
        horario_dorme: pHorarioDorme || null,
        litros_agua: pLitrosAgua ? parseFloat(pLitrosAgua) : null,
        atividade_fisica: pAtividadeFisica,
        atividade_fisica_descricao: pAtividadeFisicaDesc || null,
        observacoes: pObservacoes || null,
      }

      let result
      if (isEditingPatientId) {
        result = await supabase
          .from('pacientes')
          .update(patientData)
          .eq('id', isEditingPatientId)
          .select()
      } else {
        result = await supabase
          .from('pacientes')
          .insert([patientData])
          .select()
      }

      const { data, error } = result

      if (error) throw error

      if (data && data[0]) {
        setSuccessMsg(isEditingPatientId ? 'Paciente atualizado com sucesso!' : 'Paciente cadastrado com sucesso!')
        await loadPatientsData() // Refresh list
        setIsAddingPatient(false)
        setIsEditingPatientId(null)
        setSelectedPatientId(data[0].id) // Redirect to profile
      }
    } catch (err) {
      console.error('Erro ao salvar paciente:', err)
      setErrorMsg(err.message || 'Erro ao salvar paciente. Tente novamente.')
    } finally {
      setActionLoading(false)
    }
  }

  // Handle saving new consultation
  const handleSaveConsultation = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setActionLoading(true)

    if (!cPeso) {
      setErrorMsg('O peso atual é obrigatório.')
      setActionLoading(false)
      return
    }

    try {
      const consultationData = {
        paciente_id: selectedPatientId,
        data_consulta: cData,
        peso: parseFloat(cPeso),
        cintura: cCintura ? parseFloat(cCintura) : null,
        quadril: cQuadril ? parseFloat(cQuadril) : null,
        percentual_gordura: cGordura ? parseFloat(cGordura) : null,
        observacoes: cObservacoes || null,
        proximo_retorno: cProximoRetorno || null,
      }

      const { data, error } = await supabase
        .from('consultas')
        .insert([consultationData])
        .select()

      if (error) throw error

      if (data && data[0]) {
        setSuccessMsg('Consulta registrada com sucesso!')
        setShowConsultationModal(false)
        
        // Reset form fields
        setCData(new Date().toISOString().split('T')[0])
        setCPeso('')
        setCCintura('')
        setCQuadril('')
        setCGordura('')
        setCObservacoes('')
        setCProximoRetorno('')
        
        // Refresh patient details (loads updated consultations list and triggers chart redraw)
        await loadPatientDetails(selectedPatientId)
      }
    } catch (err) {
      console.error('Erro ao salvar consulta:', err)
      setErrorMsg(err.message || 'Erro ao salvar consulta. Tente novamente.')
    } finally {
      setActionLoading(false)
    }
  }

  // Handle direct updates of patient details from profile page tabs
  const handleUpdatePatientDetails = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setActionLoading(true)

    if (!epNome.trim()) {
      setErrorMsg('O nome completo é obrigatório.')
      setActionLoading(false)
      return
    }

    try {
      const patientData = {
        nome: epNome.trim(),
        data_nascimento: epNascimento || null,
        sexo: epSexo,
        telefone: epTelefone || null,
        whatsapp: epWhatsapp || null,
        email: epEmail || null,
        peso_inicial: epPeso ? parseFloat(epPeso) : null,
        altura: epAltura ? parseFloat(epAltura) : null,
        objetivos: epObjetivos,
        objetivo_texto: epObjetivoTexto || null,
        nivel_atividade: epNivelAtividade,
        patologias: epPatologias,
        restricoes_alimentares: epRestricoes,
        alergias: epAlergias,
        medicamentos: epMedicamentos || null,
        suplementos: epSuplementos || null,
        refeicoes_por_dia: epRefeicoesDia ? parseInt(epRefeicoesDia) : null,
        horario_acorda: epHorarioAcorda || null,
        horario_dorme: epHorarioDorme || null,
        litros_agua: epLitrosAgua ? parseFloat(epLitrosAgua) : null,
        atividade_fisica: epAtividadeFisica,
        atividade_fisica_descricao: epAtividadeFisicaDesc || null,
        observacoes: epObservacoes || null,
      }

      const { data, error } = await supabase
        .from('pacientes')
        .update(patientData)
        .eq('id', selectedPatientId)
        .select()

      if (error) throw error

      if (data && data[0]) {
        setSuccessMsg('Dados do paciente atualizados com sucesso!')
        await loadPatientsData() // Refresh general list
      }
    } catch (err) {
      console.error('Erro ao atualizar paciente:', err)
      setErrorMsg(err.message || 'Erro ao atualizar paciente. Tente novamente.')
    } finally {
      setActionLoading(false)
    }
  }

  // Render Patient Registration Form
  const renderAddPatientForm = () => {
    return (
      <div style={{ animation: 'slideIn 0.3s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Novo Paciente</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Preencha a ficha cadastral do novo paciente</p>
          </div>
          <button 
            onClick={() => { setIsAddingPatient(false); setIsEditingPatientId(null); }} 
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSavePatient} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', overflowX: 'auto' }}>
            <button 
              type="button" 
              onClick={() => setActiveFormTab('pessoal')} 
              style={{
                padding: '0.75rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeFormTab === 'pessoal' ? '3px solid var(--primary-color)' : '3px solid transparent',
                color: activeFormTab === 'pessoal' ? 'var(--primary-color)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Pessoal
            </button>
            <button 
              type="button" 
              onClick={() => setActiveFormTab('clinico')} 
              style={{
                padding: '0.75rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeFormTab === 'clinico' ? '3px solid var(--primary-color)' : '3px solid transparent',
                color: activeFormTab === 'clinico' ? 'var(--primary-color)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Clínico
            </button>
            <button 
              type="button" 
              onClick={() => setActiveFormTab('habitos')} 
              style={{
                padding: '0.75rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeFormTab === 'habitos' ? '3px solid var(--primary-color)' : '3px solid transparent',
                color: activeFormTab === 'habitos' ? 'var(--primary-color)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Hábitos
            </button>
          </div>

          {/* Tab 1: Pessoal */}
          {activeFormTab === 'pessoal' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label" htmlFor="form-nome">Nome Completo *</label>
                <input 
                  id="form-nome"
                  type="text" 
                  className="form-input" 
                  placeholder="Nome completo do paciente" 
                  value={pNome} 
                  onChange={(e) => setPNome(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-dob">Data de Nascimento</label>
                <input 
                  id="form-dob"
                  type="date" 
                  className="form-input" 
                  value={pNascimento} 
                  onChange={(e) => setPNascimento(e.target.value)} 
                />
                {pNascimento && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginTop: '0.25rem', display: 'block' }}>
                    Idade: {calculateAge(pNascimento)}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-sexo">Sexo</label>
                <select 
                  id="form-sexo"
                  className="form-input" 
                  value={pSexo} 
                  onChange={(e) => setPSexo(e.target.value)}
                >
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-telefone">Telefone</label>
                <input 
                  id="form-telefone"
                  type="tel" 
                  className="form-input" 
                  placeholder="(00) 0000-0000" 
                  value={pTelefone} 
                  onChange={(e) => setPTelefone(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-whatsapp">WhatsApp</label>
                <input 
                  id="form-whatsapp"
                  type="tel" 
                  className="form-input" 
                  placeholder="(00) 90000-0000" 
                  value={pWhatsapp} 
                  onChange={(e) => setPWhatsapp(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label" htmlFor="form-email">E-mail</label>
                <input 
                  id="form-email"
                  type="email" 
                  className="form-input" 
                  placeholder="exemplo@email.com" 
                  value={pEmail} 
                  onChange={(e) => setPEmail(e.target.value)} 
                />
              </div>
            </div>
          )}

          {/* Tab 2: Clínico */}
          {activeFormTab === 'clinico' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="form-peso">Peso (kg)</label>
                  <input 
                    id="form-peso"
                    type="number" 
                    step="0.1" 
                    className="form-input" 
                    placeholder="Ex: 72.5" 
                    value={pPeso} 
                    onChange={(e) => setPPeso(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="form-altura">Altura (cm)</label>
                  <input 
                    id="form-altura"
                    type="number" 
                    className="form-input" 
                    placeholder="Ex: 175" 
                    value={pAltura} 
                    onChange={(e) => setPAltura(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="form-imc">IMC</label>
                  <input 
                    id="form-imc"
                    type="text" 
                    className="form-input" 
                    style={{ backgroundColor: 'var(--bg-primary)', cursor: 'not-allowed' }} 
                    value={calculateIMC(pPeso, pAltura)} 
                    readOnly 
                    placeholder="Calculado automaticamente"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Objetivos</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {['Emagrecer', 'Ganhar massa', 'Controlar diabetes', 'Saúde geral', 'Performance esportiva', 'Reeducação alimentar'].map(obj => (
                    <label key={obj} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={pObjetivos.includes(obj)} 
                        onChange={() => handleArrayToggle(obj, pObjetivos, setPObjetivos)} 
                      />
                      {obj}
                    </label>
                  ))}
                </div>
                <label className="form-label" htmlFor="form-obj-txt" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Detalhes do Objetivo</label>
                <textarea 
                  id="form-obj-txt"
                  className="form-input" 
                  placeholder="Informações adicionais sobre os objetivos" 
                  value={pObjetivoTexto} 
                  onChange={(e) => setPObjetivoTexto(e.target.value)} 
                  rows={2} 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-nivel">Nível de Atividade Física</label>
                <select 
                  id="form-nivel"
                  className="form-input" 
                  value={pNivelAtividade} 
                  onChange={(e) => setPNivelAtividade(e.target.value)}
                >
                  <option value="Sedentário">Sedentário</option>
                  <option value="Levemente ativo">Levemente ativo</option>
                  <option value="Moderadamente ativo">Moderadamente ativo</option>
                  <option value="Muito ativo">Muito ativo</option>
                  <option value="Extremamente ativo">Extremamente ativo</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Patologias ou Condições de Saúde</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {['Nenhum', 'Diabetes', 'Hipertensão', 'Hipotireoidismo', 'Hipertireoidismo', 'Síndrome do ovário policístico', 'Doença celíaca', 'Colesterol alto'].map(pat => (
                    <label key={pat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={pPatologias.includes(pat)} 
                        onChange={() => handleArrayToggle(pat, pPatologias, setPPatologias)} 
                      />
                      {pat}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Adicionar patologia livremente..." 
                    value={pPatologiaLivre} 
                    onChange={(e) => setPPatologiaLivre(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => handleAddLivre(pPatologiaLivre, pPatologias, setPPatologias, setPPatologiaLivre)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Restrições Alimentares</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {['Nenhum', 'Lactose', 'Glúten', 'Açúcar', 'Carne vermelha', 'Frutos do mar'].map(res => (
                    <label key={res} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={pRestricoes.includes(res)} 
                        onChange={() => handleArrayToggle(res, pRestricoes, setPRestricoes)} 
                      />
                      {res}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Adicionar restrição livremente..." 
                    value={pRestricaoLivre} 
                    onChange={(e) => setPRestricaoLivre(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => handleAddLivre(pRestricaoLivre, pRestricoes, setPRestricoes, setPRestricaoLivre)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Alergias Alimentares</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {['Nenhum', 'Amendoim', 'Leite', 'Ovo', 'Soja', 'Trigo', 'Frutos do mar'].map(ale => (
                    <label key={ale} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={pAlergias.includes(ale)} 
                        onChange={() => handleArrayToggle(ale, pAlergias, setPAlergias)} 
                      />
                      {ale}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Adicionar alergia livremente..." 
                    value={pAlergiaLivre} 
                    onChange={(e) => setPAlergiaLivre(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => handleAddLivre(pAlergiaLivre, pAlergias, setPAlergias, setPAlergiaLivre)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-meds">Medicamentos Contínuos</label>
                <textarea 
                  id="form-meds"
                  className="form-input" 
                  placeholder="Medicamentos de uso contínuo" 
                  value={pMedicamentos} 
                  onChange={(e) => setPMedicamentos(e.target.value)} 
                  rows={2} 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-supl">Suplementos em Uso</label>
                <textarea 
                  id="form-supl"
                  className="form-input" 
                  placeholder="Suplementos alimentares ou vitamínicos em uso" 
                  value={pSuplementos} 
                  onChange={(e) => setPSuplementos(e.target.value)} 
                  rows={2} 
                />
              </div>
            </div>
          )}

          {/* Tab 3: Hábitos */}
          {activeFormTab === 'habitos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="form-refeicoes">Refeições/dia</label>
                  <input 
                    id="form-refeicoes"
                    type="number" 
                    className="form-input" 
                    placeholder="Ex: 5" 
                    value={pRefeicoesDia} 
                    onChange={(e) => setPRefeicoesDia(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="form-acorda">Horário Acorda</label>
                  <input 
                    id="form-acorda"
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: 6 ou 630" 
                    value={pHorarioAcorda} 
                    onChange={(e) => setPHorarioAcorda(e.target.value)} 
                    onBlur={(e) => handleTimeBlur(e.target.value, setPHorarioAcorda)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="form-dorme">Horário Dorme</label>
                  <input 
                    id="form-dorme"
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: 23 ou 2230" 
                    value={pHorarioDorme} 
                    onChange={(e) => setPHorarioDorme(e.target.value)} 
                    onBlur={(e) => handleTimeBlur(e.target.value, setPHorarioDorme)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-agua">Consumo de Água (Litros/dia)</label>
                <input 
                  id="form-agua"
                  type="number" 
                  step="0.1" 
                  className="form-input" 
                  placeholder="Ex: 2.5" 
                  value={pLitrosAgua} 
                  onChange={(e) => setPLitrosAgua(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={pAtividadeFisica} 
                    onChange={() => setPAtividadeFisica(!pAtividadeFisica)} 
                  />
                  Pratica atividade física?
                </label>
                
                {pAtividadeFisica && (
                  <div style={{ marginTop: '0.75rem', animation: 'slideIn 0.2s ease-out' }}>
                    <label className="form-label" htmlFor="form-ativ-desc">Descrição e Frequência</label>
                    <textarea 
                      id="form-ativ-desc"
                      className="form-input" 
                      placeholder="Qual atividade e frequência semanal? Ex: Musculação 4x/semana" 
                      value={pAtividadeFisicaDesc} 
                      onChange={(e) => setPAtividadeFisicaDesc(e.target.value)} 
                      rows={2} 
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="form-obs">Observações Gerais</label>
                <textarea 
                  id="form-obs"
                  className="form-input" 
                  placeholder="Observações complementares sobre a rotina" 
                  value={pObservacoes} 
                  onChange={(e) => setPObservacoes(e.target.value)} 
                  rows={3} 
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button 
              type="button" 
              onClick={() => { setIsAddingPatient(false); setIsEditingPatientId(null); }} 
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={actionLoading}
            >
              {actionLoading ? 'Salvando...' : 'Salvar Paciente'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <>
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme} 
        className="theme-toggle" 
        aria-label="Alternar tema"
        title="Alternar tema"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {view === 'app' && session ? (
        <div className="app-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="logo-container" style={{ justifyContent: 'flex-start', paddingLeft: '0.5rem' }}>
              <Apple className="logo-icon" size={28} />
              <span className="logo-text" style={{ fontSize: '1.5rem' }}>Sperandiu Nutri</span>
            </div>

            <nav className="menu-list">
              <li>
                <button 
                  onClick={() => { setActiveTab('dashboard'); setSelectedPatientId(null); }} 
                  className={`menu-item ${activeTab === 'dashboard' && !selectedPatientId ? 'active' : ''}`}
                >
                  <Activity size={18} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('pacientes'); setSelectedPatientId(null); }} 
                  className={`menu-item ${activeTab === 'pacientes' && !selectedPatientId ? 'active' : ''}`}
                >
                  <Users size={18} />
                  <span>Pacientes</span>
                </button>
              </li>
            </nav>

            <div className="sidebar-footer">
              <button onClick={handleSignOut} className="btn-signout">
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="main-content">
            {selectedPatientId ? (
              renderPatientProfile(selectedPatientId)
            ) : activeTab === 'dashboard' ? (
              <div style={{ animation: 'slideIn 0.3s ease-out' }}>
                <header className="dashboard-header">
                  <div className="dashboard-title-group">
                    <h1>Dashboard</h1>
                    <p>Olá, {session.user.user_metadata?.nome || session.user.email}! Acompanhe o resumo da sua clínica.</p>
                  </div>
                </header>

                {loadingDashboard ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <Activity className="logo-icon" size={32} />
                    <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>Carregando dados...</span>
                  </div>
                ) : (
                  <>
                    <section className="metrics-grid">
                      {/* Card 1: Total Patients */}
                      <div className="metric-card">
                        <div>
                          <div className="metric-label">Pacientes Ativos</div>
                          <div className="metric-val">{totalPatients}</div>
                        </div>
                        <div className="metric-icon">
                          <Users size={24} />
                        </div>
                      </div>

                      {/* Card 2: Week Consultations */}
                      <div className="metric-card">
                        <div>
                          <div className="metric-label">Consultas da Semana</div>
                          <div className="metric-val">{weekConsultations}</div>
                        </div>
                        <div className="metric-icon">
                          <Calendar size={24} />
                        </div>
                      </div>
                    </section>

                    {/* Card 3: Patients without Return */}
                    <section className="patient-list-card">
                      <h3 className="card-title">Pacientes sem Retorno (&gt; 30 dias)</h3>
                      {patientsNoReturn.length === 0 ? (
                        <div className="empty-state">
                          <CheckCircle size={36} style={{ color: 'var(--success)', marginBottom: '0.5rem' }} />
                          <p style={{ fontWeight: 600 }}>Nenhum paciente sem retorno no momento</p>
                        </div>
                      ) : (
                        <div>
                          {patientsNoReturn.map((patient) => (
                            <div key={patient.id} className="patient-list-item">
                              <div className="patient-info">
                                <h4>{patient.nome}</h4>
                                <p>Última consulta: {formatLocalDate(patient.last_date)} ({patient.days_since} dias atrás)</p>
                              </div>
                              <button 
                                onClick={() => setSelectedPatientId(patient.id)} 
                                className="patient-link"
                              >
                                Ver Ficha
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  </>
                )}
              </div>
            ) : (
              isAddingPatient ? (
                renderAddPatientForm()
              ) : (
                <div style={{ animation: 'slideIn 0.3s ease-out' }}>
                  <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                    <div className="dashboard-title-group">
                      <h1>Pacientes</h1>
                      <p>Gerencie todos os seus pacientes cadastrados.</p>
                    </div>
                  </header>

                  {/* Search and Add Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <div className="input-wrapper" style={{ flex: 1, minWidth: '280px', maxWidth: '400px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Buscar paciente por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                      />
                      <Users className="input-icon" size={18} style={{ left: '1rem' }} />
                    </div>
                    <button 
                      onClick={() => {
                        setIsAddingPatient(true);
                        setActiveFormTab('pessoal');
                        // Reset form fields
                        setPNome('');
                        setPNascimento('');
                        setPSexo('Feminino');
                        setPTelefone('');
                        setPWhatsapp('');
                        setPEmail('');
                        setPPeso('');
                        setPAltura('');
                        setPObjetivos([]);
                        setPObjetivoTexto('');
                        setPNivelAtividade('Sedentário');
                        setPPatologias([]);
                        setPPatologiaLivre('');
                        setPRestricoes([]);
                        setPRestricaoLivre('');
                        setPAlergias([]);
                        setPAlergiaLivre('');
                        setPMedicamentos('');
                        setPSuplementos('');
                        setPRefeicoesDia('');
                        setPHorarioAcorda('');
                        setPHorarioDorme('');
                        setPLitrosAgua('');
                        setPAtividadeFisica(false);
                        setPAtividadeFisicaDesc('');
                        setPObservacoes('');
                      }} 
                      className="btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      Novo Paciente
                    </button>
                  </div>

                  {loadingPatients ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                      <Activity className="logo-icon" size={32} />
                      <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>Carregando pacientes...</span>
                    </div>
                  ) : patientsList.length === 0 ? (
                    <div style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '3rem',
                      textAlign: 'center',
                      color: 'var(--text-secondary)'
                    }}>
                      <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                      <h3>Nenhum paciente cadastrado</h3>
                      <p style={{ marginTop: '0.5rem' }}>Os pacientes que você cadastrar aparecerão nesta lista.</p>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {patientsList
                        .filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((patient) => {
                          const lastConsultDate = lastConsultations[patient.id];
                          const objectivesDisplay = [
                            ...(patient.objetivos || []),
                            ...(patient.objetivo_texto ? [patient.objetivo_texto] : [])
                          ].join(' • ');

                          return (
                            <div key={patient.id} className="patient-list-item" style={{ padding: '1.25rem 0.5rem' }}>
                              <div className="patient-info">
                                <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0' }}>{patient.nome}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem 0' }}>
                                  {objectivesDisplay || 'Sem objetivos informados'}
                                </p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                  Última consulta: {lastConsultDate ? formatLocalDate(lastConsultDate) : 'Nenhuma consulta cadastrada'}
                                </p>
                              </div>
                              <button 
                                onClick={() => setSelectedPatientId(patient.id)} 
                                className="patient-link"
                              >
                                Ver Ficha
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          );
                        })}
                      {patientsList.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          Nenhum paciente encontrado com o nome "{searchTerm}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </main>
        </div>
      ) : (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-header">
              <div className="logo-container">
                <Apple className="logo-icon" size={36} />
                <span className="logo-text">Sperandiu Nutri</span>
              </div>
              <p className="auth-subtitle">
                {view === 'login' 
                  ? 'Gestão inteligente para nutricionistas' 
                  : 'Crie sua conta para começar a gerenciar'
                }
              </p>
            </div>

            {errorMsg && (
              <div className="alert alert-error">
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success">
                <CheckCircle size={20} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {view === 'login' ? (
              <form onSubmit={handleSignIn}>
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">E-mail</label>
                  <div className="input-wrapper">
                    <input
                      id="login-email"
                      type="email"
                      className="form-input"
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="input-icon" size={18} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">Senha</label>
                  <div className="input-wrapper">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Lock className="input-icon" size={18} />
                    <button
                      type="button"
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Ocultar senha" : "Exibir senha"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={actionLoading}>
                  {actionLoading ? 'Entrando...' : 'Entrar'}
                </button>

                <div className="auth-footer">
                  Não tem conta? 
                  <button 
                    type="button" 
                    className="auth-link" 
                    onClick={() => switchView('register')}
                  >
                    Cadastre-se
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUp}>
                <div className="form-group">
                  <label className="form-label" htmlFor="register-name">Nome Completo</label>
                  <div className="input-wrapper">
                    <input
                      id="register-name"
                      type="text"
                      className="form-input"
                      placeholder="Seu nome completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                    <User className="input-icon" size={18} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-email">E-mail</label>
                  <div className="input-wrapper">
                    <input
                      id="register-email"
                      type="email"
                      className="form-input"
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="input-icon" size={18} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-password">Senha (mín. 6 caracteres)</label>
                  <div className="input-wrapper">
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Lock className="input-icon" size={18} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-confirm-password">Confirmar Senha</label>
                  <div className="input-wrapper">
                    <input
                      id="register-confirm-password"
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Lock className="input-icon" size={18} />
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={actionLoading}>
                  {actionLoading ? 'Criando conta...' : 'Criar conta'}
                </button>

                <div className="auth-footer">
                  Já tem conta? 
                  <button 
                    type="button" 
                    className="auth-link" 
                    onClick={() => switchView('login')}
                  >
                    Faça login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default App
