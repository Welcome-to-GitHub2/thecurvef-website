'use client'

import Link from "next/link";

import Image from 'next/image';
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Menu, X, Phone, Mail, Download, Calculator, School, BookOpen, MessageCircle, Users, Award, FileText, CheckCircle, AlertCircle } from 'lucide-react'



export default function TheCurveFWebsite() {
  

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')



  const [showRegistration, setShowRegistration] = useState(false)
  const [showTutor, setShowTutor] = useState(false)

 

  // ==============================
// Tutor booking form state
// ==============================
const [tutorData, setTutorData] = useState({
  name: '',
  phone: '',
  grade: '',
  subjects: '',
  daysPerWeek: '',
})

const [tutorStatus, setTutorStatus] = useState({
  type: '',
  message: '',
})

// ==============================
// Contact form state
// ==============================
const [contactData, setContactData] = useState({
  name: '',
  phone: '',
  message: '',
})

const [contactStatus, setContactStatus] = useState({
  type: '',
  message: '',
})



  


  const [apsScores, setApsScores] = useState({
    subject1: '',
    subject2: '',
    subject3: '',
    subject4: '',
    subject5: '',
    subject6: '',
    subject7: ''
  })
  const [totalAps, setTotalAps] = useState(null)
  const [universityAps, setUniversityAps] = useState('')
  const [qualifyingProgrammes, setQualifyingProgrammes] = useState([])
  const [formData, setFormData] = useState({})
  const [registrationStatus, setRegistrationStatus] = useState({ type: '', message: '' });
 
  
  

  const [isSubmitting, setIsSubmitting] = useState(false)

// ✅ REGISTRATION FORM STATE (ADD THIS)
const [registrationData, setRegistrationData] = useState({
  fullName: '',
  gender: '',
  phone: '',
  school: '',
  address: '',
  referral: '',
  grade: '',
  dob: '',
  subjects: [],
  parentName: '',
  parentPhone: '',
  paymentDate: '',
  agreedToPopia: false,
})

  
  const menuItems = [
    { id: 'home', label: 'Home', icon: <School className="w-4 h-4" /> },
    { id: 'registration', label: 'Register Now', icon: <Users className="w-4 h-4" /> },
    { id: 'past-papers', label: 'Past Papers', icon: <FileText className="w-4 h-4" /> },
    { id: 'aps-calculator', label: 'APS Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'university-checker', label: 'University Checker', icon: <School className="w-4 h-4" /> },
    { id: 'nbt-practice', label: 'NBT Practice', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'matric-results', label: 'Matric Results', icon: <Award className="w-4 h-4" /> },
    { id: 'tutor', label: 'Book Tutor', icon: <Users className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Us', icon: <Mail className="w-4 h-4" /> },
    { id: 'camps', label: 'Camps', icon: <Users className="w-4 h-4" /> },
    { id: 'tutors', label: 'Tutors', icon: <Users className="w-4 h-4" /> },
    { id: 'nsfas', label: 'NSFAS & Bursaries', icon: <Award className="w-4 h-4" /> },
    { id: 'remark', label: 'Remark & Supplementary', icon: <FileText className="w-4 h-4" /> }
  ]

  const calculateAPS = () => {
    let total = 0
    let validScores = 0
    Object.values(apsScores).forEach(score => {
      const numScore = parseInt(score)
      if (numScore >= 0 && numScore <= 100) {
        if (numScore >= 80) total += 7
        else if (numScore >= 70) total += 6
        else if (numScore >= 60) total += 5
        else if (numScore >= 50) total += 4
        else if (numScore >= 40) total += 3
        else if (numScore >= 30) total += 2
        else total += 1
        validScores++
      }
    })
    if (validScores === 7) {
      setTotalAps(total)
    } else {
      setFormStatus({ type: 'error', message: 'Please enter only 6 subject scores (0-100) EXCLUDING L.O' })
      setTimeout(() => setFormStatus({ type: '', message: '' }), 3000)
    }
  }

const checkUniversities = () => {
  const aps = parseInt(universityAps)
  if (isNaN(aps) || aps < 0) {
    setFormStatus({ type: 'error', message: 'Please enter a valid APS score' })
    setTimeout(() => setFormStatus({ type: '', message: '' }), 3000)
    return
  }

  const programmes = []

  // — Top 20 Universities — (APS 20+ included)
  
  // University of Cape Town (UCT)
  if (aps >= 38) programmes.push({ uni: 'UCT', programme: 'BSc Life Sciences', minAps: 38, url: 'https://www.uct.ac.za/apply' })
  if (aps >= 36) programmes.push({ uni: 'UCT', programme: 'BA Social Sciences', minAps: 36, url: 'https://www.uct.ac.za/apply' })
  if (aps >= 32) programmes.push({ uni: 'UCT', programme: 'Diploma in Humanities', minAps: 32, url: 'https://www.uct.ac.za/apply' })
  if (aps >= 28) programmes.push({ uni: 'UCT', programme: 'Extended Programme – Science/Diploma', minAps: 28, url: 'https://www.uct.ac.za/apply' })

  // University of the Witwatersrand (WITS)
  if (aps >= 35) programmes.push({ uni: 'WITS', programme: 'BCom Business Science', minAps: 35, url: 'https://www.wits.ac.za/apply' })
  if (aps >= 33) programmes.push({ uni: 'WITS', programme: 'BSc Engineering', minAps: 33, url: 'https://www.wits.ac.za/apply' })
  if (aps >= 30) programmes.push({ uni: 'WITS', programme: 'Diploma in Humanities/Commerce', minAps: 30, url: 'https://www.wits.ac.za/apply' })
  if (aps >= 25) programmes.push({ uni: 'WITS', programme: 'Extended Access Diploma', minAps: 25, url: 'https://www.wits.ac.za/apply' })

  // University of Pretoria (UP)
  if (aps >= 34) programmes.push({ uni: 'UP', programme: 'BSc Computer Science', minAps: 34, url: 'https://www.up.ac.za/online-application' })
  if (aps >= 32) programmes.push({ uni: 'UP', programme: 'BCom Accounting', minAps: 32, url: 'https://www.up.ac.za/online-application' })
  if (aps >= 30) programmes.push({ uni: 'UP', programme: 'BA Law', minAps: 30, url: 'https://www.up.ac.za/online-application' })
  if (aps >= 25) programmes.push({ uni: 'UP', programme: 'NDip / Extended Access Programmes', minAps: 25, url: 'https://www.up.ac.za/online-application' })

  // Stellenbosch University (SU)
  if (aps >= 34) programmes.push({ uni: 'SU', programme: 'BA Humanities', minAps: 34, url: 'https://www.sun.ac.za/english/learning/Pages/Apply.aspx' })
  if (aps >= 30) programmes.push({ uni: 'SU', programme: 'BSc Extended Programme', minAps: 30, url: 'https://www.sun.ac.za/english/learning/Pages/Apply.aspx' })
  if (aps >= 25) programmes.push({ uni: 'SU', programme: 'NDip/Diploma Access', minAps: 25, url: 'https://www.sun.ac.za/english/learning/Pages/Apply.aspx' })

  // University of Johannesburg (UJ)
  if (aps >= 33) programmes.push({ uni: 'UJ', programme: 'BCom Economics', minAps: 33, url: 'https://apply.uj.ac.za' })
  if (aps >= 30) programmes.push({ uni: 'UJ', programme: 'BSc Engineering', minAps: 30, url: 'https://apply.uj.ac.za' })
  if (aps >= 25) programmes.push({ uni: 'UJ', programme: 'Diploma Programmes', minAps: 25, url: 'https://apply.uj.ac.za' })

  // University of KwaZulu-Natal (UKZN)
  if (aps >= 30) programmes.push({ uni: 'UKZN', programme: 'BSc Biological Sciences', minAps: 30, url: 'https://ukzn.ac.za/apply' })
  if (aps >= 28) programmes.push({ uni: 'UKZN', programme: 'BA Humanities', minAps: 28, url: 'https://ukzn.ac.za/apply' })
  if (aps >= 24) programmes.push({ uni: 'UKZN', programme: 'NDip / Diploma Access', minAps: 24, url: 'https://ukzn.ac.za/apply' })

  // University of the Free State (UFS)
  if (aps >= 28) programmes.push({ uni: 'UFS', programme: 'BCom Economics', minAps: 28, url: 'https://www.ufs.ac.za/apply' })
  if (aps >= 25) programmes.push({ uni: 'UFS', programme: 'Diploma Access Programmes', minAps: 25, url: 'https://www.ufs.ac.za/apply' })

  // Nelson Mandela University (NMU)
  if (aps >= 27) programmes.push({ uni: 'NMU', programme: 'BA Education', minAps: 27, url: 'https://apply.mandela.ac.za' })
  if (aps >= 23) programmes.push({ uni: 'NMU', programme: 'Diploma Access Programmes', minAps: 23, url: 'https://apply.mandela.ac.za' })

  // University of Limpopo (UL)
  if (aps >= 25) programmes.push({ uni: 'UL', programme: 'BSc Agriculture', minAps: 25, url: 'https://www.ul.ac.za/apply' })
  if (aps >= 22) programmes.push({ uni: 'UL', programme: 'Diploma Access', minAps: 22, url: 'https://www.ul.ac.za/apply' })

  // North-West University (NWU)
  if (aps >= 27) programmes.push({ uni: 'NWU', programme: 'BCom Law', minAps: 27, url: 'https://www.nwu.ac.za/apply' })
  if (aps >= 23) programmes.push({ uni: 'NWU', programme: 'Diploma Access Programmes', minAps: 23, url: 'https://www.nwu.ac.za/apply' })

  // University of South Africa (UNISA)
  if (aps >= 23) programmes.push({ uni: 'UNISA', programme: 'BCom Business Management', minAps: 23, url: 'https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission' })
  if (aps >= 22) programmes.push({ uni: 'UNISA', programme: 'Diploma / Extended Programme', minAps: 22, url: 'https://www.unisa.ac.za' })

  // University of Zululand (UNIZULU)
  if (aps >= 25) programmes.push({ uni: 'UNIZULU', programme: 'BA Humanities', minAps: 25, url: 'https://www.unizulu.ac.za/apply' })
  if (aps >= 22) programmes.push({ uni: 'UNIZULU', programme: 'Diploma Access', minAps: 22, url: 'https://www.unizulu.ac.za/apply' })

  // Walter Sisulu University (WSU)
  if (aps >= 24) programmes.push({ uni: 'WSU', programme: 'BSc Health Sciences', minAps: 24, url: 'https://www.wsu.ac.za/apply' })
  if (aps >= 20) programmes.push({ uni: 'WSU', programme: 'Diploma / Access Programmes', minAps: 20, url: 'https://www.wsu.ac.za/apply' })

  // Cape Peninsula University of Technology (CPUT)
  if (aps >= 26) programmes.push({ uni: 'CPUT', programme: 'BTech Engineering', minAps: 26, url: 'https://www.cput.ac.za/apply' })
  if (aps >= 21) programmes.push({ uni: 'CPUT', programme: 'NDip / Diploma Access', minAps: 21, url: 'https://www.cput.ac.za/apply' })

  // Vaal University of Technology (VUT)
  if (aps >= 26) programmes.push({ uni: 'VUT', programme: 'BTech Information Technology', minAps: 26, url: 'https://www.vut.ac.za/apply' })
  if (aps >= 20) programmes.push({ uni: 'VUT', programme: 'NDip / Diploma Access', minAps: 20, url: 'https://www.vut.ac.za/apply' })

  // Central University of Technology (CUT)
  if (aps >= 24) programmes.push({ uni: 'CUT', programme: 'BTech Applied Science', minAps: 24, url: 'https://www.cut.ac.za/apply' })
  if (aps >= 20) programmes.push({ uni: 'CUT', programme: 'NDip / Diploma Access', minAps: 20, url: 'https://www.cut.ac.za/apply' })

  // — Major TVET Colleges — (APS 15+)
  if (aps >= 15) programmes.push({ uni: 'TVET', programme: 'All TVET NCV Courses (Business/IT/Engineering/Hospitality)', minAps: 15, url: 'https://www.tvets.co.za' })
  if (aps >= 15) programmes.push({ uni: 'TVET', programme: 'Central Johannesburg TVET College – NCV', minAps: 15, url: 'https://www.cjc.edu.za/apply' })
  if (aps >= 15) programmes.push({ uni: 'TVET', programme: 'Tshwane North TVET College – NCV', minAps: 15, url: 'https://www.tvetcollegesportal.co.za/tshwane-north' })
  if (aps >= 15) programmes.push({ uni: 'TVET', programme: 'False Bay TVET College – NCV', minAps: 15, url: 'https://www.falsebaycollege.co.za/apply' })
  if (aps >= 15) programmes.push({ uni: 'TVET', programme: 'College of Cape Town – NCV', minAps: 15, url: 'https://www.cct.edu.za/index.php/en/apply' })
  if (aps >= 15) programmes.push({ uni: 'TVET', programme: 'Waterberg TVET College – NCV', minAps: 15, url: 'https://www.tvets.co.za' })

  setQualifyingProgrammes(programmes)
}

///////////////////////////////



  const [registrationSuccess, setRegistrationSuccess] = useState(false)
 
  
const handleFormSubmit = async (formType) => {
  setIsSubmitting(true)

  // Reset only the relevant status (never globally)
  if (formType === 'registration') {
    setRegistrationStatus({ type: '', message: '' })
  }
  if (formType === 'tutor') {
    setTutorStatus({ type: '', message: '' })
  }
  if (formType === 'contact') {
    setContactStatus({ type: '', message: '' })
  }

  let payload

  // ==============================
  // Registration (unchanged)
  // ==============================
  if (formType === 'registration') {
    payload = {
      formType: 'registration',
      fullName: registrationData.fullName,
      gender: registrationData.gender,
      phone: registrationData.phone,
      school: registrationData.school,
      address: registrationData.address,
      referral: registrationData.referral,
      grade: registrationData.grade,
      dob: registrationData.dob,
      subjects: registrationData.subjects.join(', '),
      parentName: registrationData.parentName,
      parentPhone: registrationData.parentPhone,
      paymentDate: registrationData.paymentDate,
      agreedToPopia: registrationData.agreedToPopia,
    }
  }

  // ==============================
  // Tutor booking
  // ==============================
  if (formType === 'tutor') {
    payload = {
      formType: 'tutor',
      ...tutorData,
    }
  }

  // ==============================
  // Contact form
  // ==============================
  if (formType === 'contact') {
    payload = {
      formType: 'contact',
      ...contactData,
    }
  }

  console.log('🔥 FRONTEND PAYLOAD SENT:', payload)

  try {
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Submission failed')

    // Success handling (scoped per form)
    if (formType === 'registration') {
      setRegistrationStatus({ type: 'success', message: 'Form submitted successfully' })
      setRegistrationSuccess(true)
    }

    if (formType === 'tutor') {
      setTutorStatus({ type: 'success', message: 'Tutor request submitted successfully' })
      setTutorData({
        name: '',
        phone: '',
        grade: '',
        subjects: '',
        daysPerWeek: '',
      })
    }

    if (formType === 'contact') {
      setContactStatus({ type: 'success', message: 'Message sent successfully' })
      setContactData({
        name: '',
        phone: '',
        message: '',
      })
    }

  } catch (err) {
    if (formType === 'registration') {
      setRegistrationStatus({ type: 'error', message: err.message })
    }
    if (formType === 'tutor') {
      setTutorStatus({ type: 'error', message: err.message })
    }
    if (formType === 'contact') {
      setContactStatus({ type: 'error', message: err.message })
    }
  } finally {
    setIsSubmitting(false)
  }
}



  const pastPapers = [
  {
    year: 2025,
    subjects: [
      {
        name: "Mathematics P1",
        paper: "https://www.saexampapers.co.za/grade-12-mathematics/",
        memo: "https://www.saexampapers.co.za/grade-12-mathematics/"
      },
      {
        name: "Mathematics P2",
        paper: "https://www.saexampapers.co.za/grade-12-mathematics/",
        memo: "https://www.saexampapers.co.za/grade-12-mathematics/"
      },
      {
        name: "Physical Sciences P1",
        paper: "https://www.saexampapers.co.za/grade-12-physical-sciences/",
        memo: "https://www.saexampapers.co.za/grade-12-physical-sciences/"
      },
      {
        name: "Physical Sciences P2",
        paper: "https://www.saexampapers.co.za/grade-12-physical-sciences/",
        memo: "https://www.saexampapers.co.za/grade-12-physical-sciences/"
      },
      {
        name: "Life Sciences P1",
        paper: "https://www.saexampapers.co.za/grade-12-life-sciences/",
        memo: "https://www.saexampapers.co.za/grade-12-life-sciences/"
      },
      {
        name: "Life Sciences P2",
        paper: "https://www.saexampapers.co.za/grade-12-life-sciences/",
        memo: "https://www.saexampapers.co.za/grade-12-life-sciences/"
      },
      {
        name: "English HL P1",
        paper: "https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx",
        memo: "https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx"
      },
      {
        name: "English HL P2",
        paper: "https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx",
        memo: "https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx"
      },
      {
        name: "Afrikaans HL P1",
        paper: "https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx",
        memo: "https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx"
      }
    ]
  },

  {
    year: 2024,
    subjects: [
      {
        name: "Mathematics P1",
        paper: "https://wcedeportal.co.za/eresource/246696",
        memo: "https://wcedeportal.co.za/eresource/246696"
      },
      {
        name: "Accounting",
        paper: "https://www.saexampapers.co.za/grade-12-accounting/",
        memo: "https://www.saexampapers.co.za/grade-12-accounting/"
      },
      {
        name: "Business Studies",
        paper: "https://www.saexampapers.co.za/grade-12-business-studies/",
        memo: "https://www.saexampapers.co.za/grade-12-business-studies/"
      },
      {
        name: "Economics",
        paper: "https://www.saexampapers.co.za/grade-12-economics/",
        memo: "https://www.saexampapers.co.za/grade-12-economics/"
      }
    ]
  },

  {
    year: 2023,
    subjects: [
      {
        name: "All Subjects",
        paper: "https://www.saexampapers.co.za/",
        memo: "https://www.saexampapers.co.za/"
      }
    ]
  },

  {
    year: 2022,
    subjects: [
      {
        name: "All NSC Subjects Available",
        paper: "https://www.saexampapers.co.za/",
        memo: "https://www.saexampapers.co.za/"
      }
    ]
  },

  {
    year: 2021,
    subjects: [
      {
        name: "All NSC Subjects Available",
        paper: "https://www.saexampapers.co.za/",
        memo: "https://www.saexampapers.co.za/"
      }
    ]
  },

  {
    year: 2020,
    subjects: [
      {
        name: "All NSC Subjects Available",
        paper: "https://www.saexampapers.co.za/",
        memo: "https://www.saexampapers.co.za/"
      }
    ]
  }
];


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F4C5C] via-[#0F4C5C] to-[#1a5f71]">
      {/* Navigation */}
      <nav className="bg-[#0F4C5C]/90 backdrop-blur-sm border-b border-[#F5B041]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
           <button
  onClick={() => {
    setCurrentPage('home')
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }}
  className="flex items-center space-x-3 hover:opacity-90 transition"
>
  <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
    <Image
      src="/images/logo.jpg"
      alt="TheCurveF logo"
      width={48}
      height={48}
      className="object-cover"
      priority
    />
  </div>

  <div className="text-left">
    <h1 className="text-white font-bold text-xl">TheCurveF</h1>
    <p className="text-[#F5B041] text-xs">
      Education Brought To You In Style
    </p>
  </div>
</button>




{/* Desktop Menu */}
<div className="hidden lg:flex items-center space-x-1">
  {menuItems.slice(0, 6).map(item => (
    <button
      key={item.id}
      onClick={() => setCurrentPage(item.id)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
        currentPage === item.id
          ? 'bg-[#FF6B35] text-white'
          : 'text-white hover:bg-white/10'
      }`}
    >
      {item.icon}
      <span>{item.label}</span>
    </button>
  ))}

  <Select value={currentPage} onValueChange={setCurrentPage}>
    <SelectTrigger className="w-32 bg-white/10 text-white border-[#F5B041]">
      <SelectValue placeholder="More" />
    </SelectTrigger>
    <SelectContent>
      {menuItems.slice(6).map(item => (
        <SelectItem key={item.id} value={item.id}>
          <div className="flex items-center space-x-2">
            {item.icon}
            <span>{item.label}</span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  <button
  onClick={() => {
    setShowRegistration(true)
    setShowTutor(false)

    // 🔥 RESET SUCCESS MESSAGES
    setRegistrationStatus({ type: '', message: '' })
    setTutorStatus({ type: '', message: '' })
  }}
  className="ml-4 px-4 py-2 rounded-lg bg-[#F5B041] text-[#0F4C5C] font-semibold hover:bg-[#FFD166] transition"
>
  Student Registration
</button>

</div>

{/* Mobile Menu Button */}
<button
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="lg:hidden p-3 bg-[#FF6B35] text-white rounded-lg shadow-lg hover:bg-[#FF6B35]/90 transition-all"
>
  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
</button>
</div>

{/* Mobile Menu */}
{mobileMenuOpen && (
  <div className="lg:hidden mt-4 pb-4 space-y-2">
    {menuItems.map(item => (
      <button
        key={item.id}
        onClick={() => {
          setCurrentPage(item.id)
          setMobileMenuOpen(false)
        }}
        className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center space-x-3 ${
          currentPage === item.id
            ? 'bg-[#FF6B35] text-white'
            : 'text-white hover:bg-white/10'
        }`}
      >
        {item.icon}
        <span>{item.label}</span>
      </button>
    ))}
  </div>
)}
</div>
</nav>

{/* Main Content */}
<main className="container mx-auto px-4 py-8">
  {currentPage === 'home' && (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl pb-24 md:pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C5C]/95 to-[#0F4C5C]/80 z-10" />

        <img
          src="/images/hero-bg.jpg"
          alt="Students studying together"
          className="w-full h-[520px] md:h-[600px] object-cover"
        />

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-3xl">
              <div className="flex space-x-2 mb-6">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-14 h-3 bg-gradient-to-r from-[#F5B041] via-[#FF6B35] to-[#F5B041] rounded-full"
                  />
                ))}
              </div>

              <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Ace Your Matric.
                <span className="text-[#F5B041]"> Get Into University.</span>
              </h1>

              <p className="text-base md:text-xl text-white/90 mb-8 leading-relaxed">
                Free past papers, APS calculator, expert tutoring, and university preparation for Mpumalanga & Gauteng learners.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => setCurrentPage('past-papers')}
                  className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-semibold px-6 py-5 rounded-xl shadow-xl"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Free Past Papers
                </Button>

                {/* ✅ HERO: Book a Tutor button — FIXED */}
<Button
  onClick={() => setCurrentPage('tutor')} // ← navigation restored
  className="bg-[#F5B041] hover:bg-[#F5B041]/90 text-[#0F4C5C] px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
>
  <Users className="w-5 h-5" />
  Book a Tutor
</Button>



                <button
                  onClick={() => setCurrentPage('registration')}
                  className="bg-[#FF6B35] text-white px-6 py-5 rounded-xl font-semibold shadow-xl hover:opacity-90"
                >
                  Register Now – Space Limited
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 grid md:grid-cols-3 gap-6">
        <Card className="bg-white/95 border-none shadow-xl">
          <CardContent className="pt-6 text-center">
            <div className="text-5xl font-bold text-[#FF6B35] mb-2">5000+</div>
            <p className="text-gray-600 font-medium">Papers Downloaded</p>
          </CardContent>
        </Card>

        <Card className="bg-white/95 border-none shadow-xl">
          <CardContent className="pt-6 text-center">
            <div className="text-5xl font-bold text-[#F5B041] mb-2">8+</div>
            <p className="text-gray-600 font-medium">Years of Camps</p>
          </CardContent>
        </Card>

        <Card className="bg-white/95 border-none shadow-xl">
          <CardContent className="pt-6 text-center">
            <div className="text-5xl font-bold text-[#0F4C5C] mb-2">500+</div>
            <p className="text-gray-600 font-medium">Students Helped</p>
          </CardContent>
        </Card>
      </section>

      {/* Quick Access Tools */}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                className="cursor-pointer hover:shadow-2xl transition-all bg-white/95 border-t-4 border-[#FF6B35]"
                onClick={() => setCurrentPage('aps-calculator')}
              >
                <CardHeader>
                  <Calculator className="w-12 h-12 text-[#FF6B35] mb-2" />
                  <CardTitle>APS Calculator</CardTitle>
                  <CardDescription>Calculate your APS score instantly</CardDescription>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-2xl transition-all bg-white/95 border-t-4 border-[#F5B041]"
                onClick={() => setCurrentPage('university-checker')}
              >
                <CardHeader>
                  <School className="w-12 h-12 text-[#F5B041] mb-2" />
                  <CardTitle>University Checker</CardTitle>
                  <CardDescription>Find qualifying programmes</CardDescription>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-2xl transition-all bg-white/95 border-t-4 border-[#0F4C5C]"
                onClick={() => setCurrentPage('nbt-practice')}
              >
                <CardHeader>
                  <BookOpen className="w-12 h-12 text-[#0F4C5C] mb-2" />
                  <CardTitle>NBT Practice</CardTitle>
                  <CardDescription>Prepare for NBT tests</CardDescription>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-2xl transition-all bg-white/95 border-t-4 border-[#FF6B35]"
                onClick={() => setCurrentPage('matric-results')}
              >
                <CardHeader>
                  <Award className="w-12 h-12 text-[#FF6B35] mb-2" />
                  <CardTitle>Matric Results</CardTitle>
                  <CardDescription>Check your results </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}

        {/* Past Papers Page */}
        {currentPage === 'past-papers' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-white mb-4">NSC & IEB Past Papers</h2>
              <p className="text-xl text-white/80">Download past papers and memorandums from 2015-2025</p>
            </div>

            <div className="grid gap-6">
              {pastPapers.map(year => (
                <Card key={year.year} className="bg-white/95 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-3xl text-[#0F4C5C]">{year.year} Past Papers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {year.subjects.map((subject, idx) => (
  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <span className="font-medium text-gray-700">{subject.name}</span>

    <div className="flex space-x-2">
      <a href={subject.paper} target="_blank" rel="noopener noreferrer">
        <Button size="sm" variant="outline" className="text-[#0F4C5C]">
          Paper
        </Button>
      </a>

      <a href={subject.memo} target="_blank" rel="noopener noreferrer">
        <Button size="sm" variant="outline" className="text-[#FF6B35]">
          Memo
        </Button>
      </a>
    </div>
  </div>
))}

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-[#F5B041]/10 border-[#F5B041]">
              <CardContent className="pt-6">
                <p className="text-white text-center">
                  <strong>Note:</strong> All papers are free to download. For additional support with past papers, consider booking a tutor!
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* APS Calculator */}
        {currentPage === 'aps-calculator' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <Calculator className="w-20 h-20 text-[#F5B041] mx-auto mb-4" />
              <h2 className="text-5xl font-bold text-white mb-4">APS Calculator</h2>
              <p className="text-xl text-white/80">Calculate your Admission Point Score for university applications</p>
            </div>

            <Card className="bg-white/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0F4C5C]">Enter Your 7 Subject Marks (0-100%)</CardTitle>
                <CardDescription>Enter percentages for your best 7 subjects including Life Orientation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <div key={num}>
                    <Label htmlFor={`subject${num}`} className="text-gray-700 font-medium">
                      Subject {num} Percentage
                    </Label>
                    <Input
                      id={`subject${num}`}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter percentage (0-100)"
                      value={apsScores[`subject${num}`]}
                      onChange={(e) => setApsScores({ ...apsScores, [`subject${num}`]: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                ))}

                <Button
                  onClick={calculateAPS}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white py-6 text-lg font-semibold rounded-xl"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate APS
                </Button>

                {totalAps !== null && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-[#0F4C5C] to-[#1a5f71] rounded-xl text-center">
                    <p className="text-white/80 text-lg mb-2">Your Total APS Score:</p>
                    <p className="text-6xl font-bold text-[#F5B041]">{totalAps}</p>
                    <p className="text-white/80 mt-4">Maximum possible APS: 42</p>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-[#0F4C5C] mb-2">How APS is Calculated:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 80-100% = 7 points</li>
                    <li>• 70-79% = 6 points</li>
                    <li>• 60-69% = 5 points</li>
                    <li>• 50-59% = 4 points</li>
                    <li>• 40-49% = 3 points</li>
                    <li>• 30-39% = 2 points</li>
                    <li>• 0-29% = 1 point</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* University Checker */}
        {currentPage === 'university-checker' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <School className="w-20 h-20 text-[#F5B041] mx-auto mb-4" />
              <h2 className="text-5xl font-bold text-white mb-4">University Programme Checker</h2>
              <p className="text-xl text-white/80">Find qualifying programmes at UP, UJ, TUT, and UMP</p>
            </div>

            <Card className="bg-white/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0F4C5C]">Check Your Qualifying Programmes</CardTitle>
                <CardDescription>Enter your APS score to see which programmes you qualify for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="aps-input" className="text-gray-700 font-medium">
                    Your APS Score
                  </Label>
                  <Input
                    id="aps-input"
                    type="number"
                    min="0"
                    max="42"
                    placeholder="Enter your APS (0-42)"
                    value={universityAps}
                    onChange={(e) => setUniversityAps(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={checkUniversities}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white py-6 text-lg font-semibold rounded-xl"
                >
                  <School className="w-5 h-5 mr-2" />
                  Check Programmes
                </Button>

                {qualifyingProgrammes.length > 0 && (
  <div className="mt-6 space-y-4">
    <h3 className="text-2xl font-bold text-[#0F4C5C]">You Qualify For:</h3>

    {Array.from(new Set(qualifyingProgrammes.map(p => p.uni))).map((uni) => {
      const uniProgrammes = qualifyingProgrammes.filter(p => p.uni === uni)
      if (uniProgrammes.length === 0) return null

      // Map your uni code to full name
      const uniNames = {
        UP: 'University of Pretoria',
        UJ: 'University of Johannesburg',
        TUT: 'Tshwane University of Technology',
        UMP: 'University of Mpumalanga',
        UCT: 'University of Cape Town',
        WITS: 'University of the Witwatersrand',
        SU: 'Stellenbosch University',
        UKZN: 'University of KwaZulu-Natal',
        UFS: 'University of the Free State',
        NMU: 'Nelson Mandela University',
        UNISA: 'University of South Africa',
        UNIZULU: 'University of Zululand',
        WSU: 'Walter Sisulu University',
        CPUT: 'Cape Peninsula University of Technology',
        VUT: 'Vaal University of Technology',
        CUT: 'Central University of Technology',
        UL: 'University of Limpopo',
        NWU: 'North-West University',
        TVET: 'TVET Colleges'
      }

      return (
        <Card key={uni} className="border-l-4 border-[#F5B041]">
          <CardHeader>
            <CardTitle className="text-xl">
              {uniNames[uni] || uni}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uniProgrammes.map((prog, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 border rounded bg-white/90 shadow-sm">
                  <span>{prog.programme}</span>
                  <a href={prog.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Apply
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    })}
  </div>
)}


                {qualifyingProgrammes.length === 0 && universityAps && (
                  <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-gray-700">Enter your APS score and click "Check Programmes" to see your options.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* NBT Practice Hub */}
        {currentPage === 'nbt-practice' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <BookOpen className="w-20 h-20 text-[#F5B041] mx-auto mb-4" />
              <h2 className="text-5xl font-bold text-white mb-4">NBT Practice Hub</h2>
              <p className="text-xl text-white/80">Prepare for your National Benchmark Tests</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/95 shadow-xl hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#0F4C5C]">Quantitative Literacy (QL)</CardTitle>
                  <CardDescription>Practice mathematical problem-solving and data interpretation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white" asChild>
                    <a href="https://www.nbt.ac.za" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Practice QL Tests
                    </a>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <a href="https://www.nbt.ac.za" target="_blank" rel="noopener noreferrer">
                      View Sample Questions
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 shadow-xl hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#0F4C5C]">Mathematics (MAT)</CardTitle>
                  <CardDescription>Test your mathematical competence and problem-solving skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white" asChild>
                    <a href="https://www.nbt.ac.za" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Practice MAT Tests
                    </a>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <a href="https://www.nbt.ac.za" target="_blank" rel="noopener noreferrer">
                      View Sample Questions
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 shadow-xl hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#0F4C5C]">Academic Literacy (AL)</CardTitle>
                  <CardDescription>Improve reading comprehension and academic writing skills</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white" asChild>
                    <a href="https://www.nbt.ac.za" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Practice AL Tests
                    </a>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <a href="https://www.nbt.ac.za" target="_blank" rel="noopener noreferrer">
                      View Sample Questions
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#0F4C5C] to-[#1a5f71] text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Need NBT Help?</CardTitle>
                  <CardDescription className="text-white/80">Book a tutor for personalized NBT preparation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setCurrentPage('book-tutor')}
                    className="w-full bg-[#F5B041] hover:bg-[#F5B041]/90 text-[#0F4C5C] font-semibold"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Book NBT Tutor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

       

       

        {/* Book Tutor Form */}
        {currentPage === 'tutor' && (

          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <Users className="w-20 h-20 text-[#F5B041] mx-auto mb-4" />
              <h2 className="text-5xl font-bold text-white mb-4">Book a Tutor</h2>
              <p className="text-xl text-white/80">Get expert help from our qualified tutors</p>
            </div>

            <Card className="bg-white/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0F4C5C]">Tutor Booking Request</CardTitle>
                <CardDescription>Fill in your details and we'll contact you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tutor-name" className="text-gray-700 font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="tutor-name"
                    placeholder="Enter your full name"
                    value={tutorData.name}
                    onChange={(e) =>
                     setTutorData({ ...tutorData, name: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tutor-phone" className="text-gray-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="tutor-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={tutorData.phone}
                    onChange={(e) =>
                     setTutorData({ ...tutorData, phone: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tutor-grade" className="text-gray-700 font-medium">
                    Grade *
                  </Label>
                  <Select
  value={tutorData.grade}
  onValueChange={(value) =>
    setTutorData({ ...tutorData, grade: value })
  }
>

                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {[8, 9, 10, 11, 12].map(grade => (
                        <SelectItem key={grade} value={`Grade ${grade}`}>Grade {grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tutor-subjects" className="text-gray-700 font-medium">
                    Subjects Needed *
                  </Label>
                  <Textarea
                    id="tutor-subjects"
                    placeholder="e.g., Mathematics, Physical Sciences, Life Sciences"
                    value={tutorData.subjects}
  onChange={(e) =>
    setTutorData({ ...tutorData, subjects: e.target.value })}
                    className="mt-1"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tutor-days" className="text-gray-700 font-medium">
                    Days Per Week *
                  </Label>
                  <Select
  value={tutorData.daysPerWeek}
  onValueChange={(value) =>
    setTutorData({ ...tutorData, daysPerWeek: value })
  }
>

                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select days per week" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map(days => (
                        <SelectItem key={days} value={`${days} days`}>{days} {days === 1 ? 'day' : 'days'} per week</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tutor status message */}
{tutorStatus.message && (
  <div className={tutorStatus.type === 'success'
    ? 'bg-green-50 border border-green-200'
    : 'bg-red-50 border border-red-200'}
  >
    {tutorStatus.message}
  </div>
)}



                <Button
                  onClick={() => handleFormSubmit('tutor')}
                  disabled={
                   isSubmitting ||
                   !tutorData.name ||
                   !tutorData.phone ||
                   !tutorData.grade ||
                   !tutorData.subjects ||
                   !tutorData.daysPerWeek
                   }
                  className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white py-6 text-lg font-semibold rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Request Tutor Booking'}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  We'll contact you via WhatsApp and email within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#0F4C5C] to-[#1a5f71] text-white">
              <CardHeader>
                <CardTitle className="text-xl">Why Choose TheCurveF Tutors?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white/90">
                  <li>✓ Proffesional and experienced tutors</li>
                  <li>✓ Flexible scheduling</li>
                  <li>✓ Personalized learning approach</li>
                  <li>✓ Proven track record since 2017</li>
                  <li>✓ Affordable rates</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Form */}
        {currentPage === 'contact' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <Mail className="w-20 h-20 text-[#F5B041] mx-auto mb-4" />
              <h2 className="text-5xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-xl text-white/80">Get in touch with any questions or inquiries</p>
            </div>

            <Card className="bg-white/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0F4C5C]">Send Us a Message</CardTitle>
                <CardDescription>We'll respond within 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-name" className="text-gray-700 font-medium">
                    Full Name *
                  </Label>
                  
                  <Input
                   value={contactData.name}
                   onChange={(e) =>
                     setContactData({ ...contactData, name: e.target.value })
                   }
                  />

                </div>

                <div>
                  <Label htmlFor="contact-phone" className="text-gray-700 font-medium">
                    Phone Number *
                  </Label>
                  
                  <Input
                   value={contactData.phone}
                   onChange={(e) =>
                     setContactData({ ...contactData, phone: e.target.value })
                   }
                  />

                </div>

                <div>
                  <Label htmlFor="contact-message" className="text-gray-700 font-medium">
                    Message *
                  </Label>
                 
                  <Textarea
                    id="contact-message"
                    placeholder="Tell us how we can help you..."
                    value={contactData.message}
                    onChange={(e) =>
                      setContactData({ ...contactData, message: e.target.value })
                    }
                    className="mt-1"
                    rows={5}
                    required
                  />


                </div>

   {/* Tutor status message */}
{tutorStatus.message && (
  <div className={tutorStatus.type === 'success'
    ? 'bg-green-50 border border-green-200'
    : 'bg-red-50 border border-red-200'}
  >
    {tutorStatus.message}
  </div>
)}

{/* Contact form status message */}
{contactStatus.message && (
  <div className={contactStatus.type === 'success'
    ? 'bg-green-50 border border-green-200'
    : 'bg-red-50 border border-red-200'}
  >
    {contactStatus.message}
  </div>
)}



                <Button
                onClick={() => handleFormSubmit('contact')}
                disabled={
                  isSubmitting ||
                  !contactData.name ||
                  !contactData.phone ||
                  !contactData.message
                }

                  className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white py-6 text-lg font-semibold rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/95">
                <CardContent className="pt-6">
                  <Phone className="w-8 h-8 text-[#FF6B35] mb-3" />
                  <h3 className="font-semibold text-[#0F4C5C] mb-2">WhatsApp</h3>
                  <p className="text-gray-600">+230 5811 5977</p>
                </CardContent>
              </Card>
              <Card className="bg-white/95">
                <CardContent className="pt-6">
                  <Mail className="w-8 h-8 text-[#F5B041] mb-3" />
                  <h3 className="font-semibold text-[#0F4C5C] mb-2">Email</h3>
                  <p className="text-gray-600">Info@thecurvef.co.za</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
        )}

        

{/* Student Registration Form */}
{currentPage === 'registration' && (
  <div className="max-w-2xl mx-auto space-y-8">

    {/* Header */}
    <div className="text-center mb-12">
      <img src="/images/logo.jpg" alt="TheCurveF" className="mx-auto h-20 mb-4" />
      <h2 className="text-4xl font-bold text-white mb-2">
        2026 Student Registration
      </h2>
      <p className="text-white/80">
        Secure your spot early — limited spaces available
      </p>
    </div>

    <Card className="bg-white/95 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-[#0F4C5C]">
          Learner Information
        </CardTitle>
        <CardDescription>
          Please complete all required fields
        </CardDescription>
      </CardHeader>

{/* ✅ REGISTRATION FORM */}
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleFormSubmit('registration');
  }}
>
  <CardContent className="space-y-4">

    <Input
      placeholder="Learner Full Name"
      value={registrationData.fullName}
      onChange={(e) =>
        setRegistrationData({ ...registrationData, fullName: e.target.value })
      }
      required
    />

    <Select
      value={registrationData.gender}
      onValueChange={(value) =>
        setRegistrationData({ ...registrationData, gender: value })
      }
      required
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Gender" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Male">Male</SelectItem>
        <SelectItem value="Female">Female</SelectItem>
        <SelectItem value="Other">Other</SelectItem>
        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
      </SelectContent>
    </Select>

    <Input
      placeholder="Phone Number"
      value={registrationData.phone}
      onChange={(e) =>
        setRegistrationData({ ...registrationData, phone: e.target.value })
      }
      required
    />

    <Input
      placeholder="School Name"
      value={registrationData.school}
      onChange={(e) =>
        setRegistrationData({ ...registrationData, school: e.target.value })
      }
      required
    />

    <Textarea
      placeholder="Physical Address"
      rows={2}
      value={registrationData.address}
      onChange={(e) =>
        setRegistrationData({ ...registrationData, address: e.target.value })
      }
    />

    <Input
      placeholder="Where did you hear about us?"
      value={registrationData.referral}
      onChange={(e) =>
        setRegistrationData({ ...registrationData, referral: e.target.value })
      }
    />

    <Select
      value={registrationData.grade}
      onValueChange={(value) =>
        setRegistrationData({ ...registrationData, grade: value })
      }
      required
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Grade" />
      </SelectTrigger>
      <SelectContent>
        {[8, 9, 10, 11, 12].map((g) => (
          <SelectItem key={g} value={`Grade ${g}`}>
            Grade {g}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <div>
      <Label>Learner Date of Birth</Label>
      <Input
        type="date"
        value={registrationData.dob}
        onChange={(e) =>
          setRegistrationData({ ...registrationData, dob: e.target.value })
        }
        required
      />
    </div>

    {/* Subjects */}
    <div>
      <p className="font-medium text-gray-700 mb-2">Subjects</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {[
          'Mathematics',
          'Mathematical Literacy',
          'Physical Sciences',
          'Geography',
          'Life Sciences',
          'History',
          'Natural Sciences / Technology',
          'Tourism',
          'Agriculture',
          'Economics',
          'Business Studies',
          'Accounting',
          'Social Sciences',
          'EMS',
        ].map((subject) => (
          <label key={subject} className="flex gap-2">
            <input
              type="checkbox"
              checked={registrationData.subjects.includes(subject)}
              onChange={(e) => {
                const checked = e.target.checked;
                setRegistrationData((prev) => ({
                  ...prev,
                  subjects: checked
                    ? [...prev.subjects, subject]
                    : prev.subjects.filter((s) => s !== subject),
                }));
              }}
            />
            {subject}
          </label>
        ))}
      </div>
    </div>

    {/* Parent Info */}
    <div className="pt-4 border-t">
      <h3 className="font-semibold text-[#0F4C5C] mb-2">
        Parent’s Information
      </h3>

      <Input
        placeholder="Parent Full Name"
        value={registrationData.parentName}
        onChange={(e) =>
          setRegistrationData({
            ...registrationData,
            parentName: e.target.value,
          })
        }
        required
      />

      <Input
        placeholder="Parent Phone Number"
        value={registrationData.parentPhone}
        onChange={(e) =>
          setRegistrationData({
            ...registrationData,
            parentPhone: e.target.value,
          })
        }
        required
      />

      <div>
        <Label>Payment Date</Label>
        <Input
          type="date"
          value={registrationData.paymentDate}
          onChange={(e) =>
            setRegistrationData({
              ...registrationData,
              paymentDate: e.target.value,
            })
          }
        />
      </div>
    </div>

    {/* POPIA */}
    <label className="flex gap-2 text-sm text-gray-600">
      <input
        type="checkbox"
        checked={registrationData.agreedToPopia}
        onChange={(e) =>
          setRegistrationData({
            ...registrationData,
            agreedToPopia: e.target.checked,
          })
        }
        required
      />
      I consent to my information being processed in accordance with POPIA.
    </label>

    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-[#FF6B35] text-white py-6 text-lg font-semibold rounded-xl"
    >
      {registrationSuccess ? 'Successfully submitted ✅' : 'Submit Registration'}
    </Button>

   {/* ✅ Registration status message */}
{registrationStatus.message && (
  <p
    className={`text-sm ${
      registrationStatus.type === 'success'
        ? 'text-green-600'
        : 'text-red-600'
    }`}
  >
    {registrationStatus.message}
  </p>
)}

  </CardContent>
</form>

    </Card>
  </div>
)}

        {/* Camps Gallery */}
        {currentPage === 'camps' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <Users className="w-20 h-20 text-[#F5B041] mx-auto mb-4" />
              <h2 className="text-5xl font-bold text-white mb-4">Holiday Camps & Workshops</h2>
              <p className="text-xl text-white/80">Annual camps since 2017 helping students excel</p>
            </div>

            <Card className="bg-white/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0F4C5C]">View Our Camp Memories</CardTitle>
                <CardDescription>See photos and testimonials from our past camps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video w-full rounded-xl overflow-hidden">
                  <img
                    src="/images/cam1.jpg"
                    alt="Students in classroom"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <img
                    src="/images/cam2.jpg"
                    alt="Student learning"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <img
                    src="/images/uni9.jpg"
                    alt="Graduation success"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <Card className="bg-gradient-to-r from-[#0F4C5C] to-[#1a5f71] text-white">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">More Photos & Videos</h3>
                    <p className="mb-4 text-white/90">
                      Visit our Facebook page to see all photos, videos, and testimonials from our camps since 2017.
                    </p>
                    <Button
                      className="bg-[#F5B041] hover:bg-[#F5B041]/90 text-[#0F4C5C] font-semibold"
                      asChild
                    >
                      <a href="https://www.facebook.com/TheCurveF" target="_blank" rel="noopener noreferrer">
                        Visit Our Facebook Page
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#0F4C5C]">Upcoming Camps 2026</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>June Holiday Camp</CardTitle>
                        <CardDescription>Mid-year revision bootcamp</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Intensive revision for all grades, focusing on mid-year exam preparation</p>
                        <Button className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white">
                          Register Interest
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>October/November Matric Camp</CardTitle>
                        <CardDescription>Final exam preparation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Intensive final push for Grade 12 learners before finals</p>
                        <Button className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white">
                          Register Interest
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Meet Your Tutors */}
        {currentPage === 'tutors' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <Users className="w-20 h-20 text-[#F5B041] mx-auto mb-4" />
              <h2 className="text-5xl font-bold text-white mb-4">Meet Your Tutors</h2>
              <p className="text-xl text-white/80">Proffesional, experienced, and passionate educators</p>
            </div>

            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
  {/* Background Image */}
  <img
    src="/images/tutors-team.jpg"   // ← replace with your actual image path
    alt="Our Experienced Tutors"
    className="w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Text Content */}
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
      Our Experienced Tutors
    </h2>

    <p className="text-lg md:text-xl text-white/90 max-w-3xl">
      A proven team of top-performing tutors dedicated to helping learners
      achieve academic excellence and unlock their full potential.
    </p>
  </div>
</div>


            <Card className="bg-gradient-to-r from-[#0F4C5C] to-[#1a5f71] text-white shadow-2xl">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold mb-4">Meet Our Full Team</h3>
                <p className="mb-6 text-white/90 text-lg">
                  Visit our Facebook page to see all our tutors, read their testimonials, and learn more about our teaching approach.
                </p>
                <Button
                  className="bg-[#F5B041] hover:bg-[#F5B041]/90 text-[#0F4C5C] font-semibold"
                  size="lg"
                  asChild
                >
                  <a href="https://www.facebook.com/TheCurveF" target="_blank" rel="noopener noreferrer">
                    View Full Team on Facebook
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* NSFAS & Bursaries */}
        {currentPage === 'nsfas' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <Award className="w-20 h-20 text-[#F5B041] mx-auto mb-4" />
              <h2 className="text-5xl font-bold text-white mb-4">NSFAS & Bursaries</h2>
              <p className="text-xl text-white/80">Financial aid to help you get to university</p>
            </div>

            <Card className="bg-white/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl text-[#0F4C5C]">NSFAS Applications</CardTitle>
                <CardDescription className="text-lg">National Student Financial Aid Scheme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  NSFAS provides financial aid to eligible students to pursue higher education at public universities and TVET colleges.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#0F4C5C]">Eligibility Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• South African citizen</li>
                    <li>• Combined household income ≤ R350,000 per year</li>
                    <li>• Must be accepted at a public university or TVET college</li>
                    <li>• Must meet academic requirements</li>
                  </ul>
                </div>
                <Button className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white" asChild>
                  <a href="https://www.nsfas.org.za" target="_blank" rel="noopener noreferrer">
                    Apply on NSFAS Website
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl text-[#0F4C5C]">Top Bursaries for 2026</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { name: 'Funza Lushaka Bursary', field: 'Teaching', details: 'For students pursuing teaching degrees' },
                    { name: 'Department of Health Bursary', field: 'Healthcare', details: 'Medical and nursing students' },
                    { name: 'Eskom Bursary', field: 'Engineering', details: 'Engineering and technical fields' },
                    { name: 'Sasol Bursary', field: 'Science & Engineering', details: 'Various STEM fields' },
                    { name: 'Anglo American Bursary', field: 'Mining & Engineering', details: 'Mining-related studies' }
                  ].map((bursary, idx) => (
                    <Card key={idx} className="border-l-4 border-[#F5B041]">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-[#0F4C5C]">{bursary.name}</h4>
                            <p className="text-sm text-gray-600">{bursary.details}</p>
                          </div>
                          <Badge className="bg-[#0F4C5C] text-white">{bursary.field}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/80 text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Need Help with Applications?</CardTitle>
                <CardDescription className="text-white/90">Professional application assistance service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90">
                  Our team can help you complete your NSFAS and bursary applications correctly, increasing your chances of approval.
                </p>
                <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                  <div>
                    <p className="font-semibold text-lg">Application Help Service</p>
                    <p className="text-sm text-white/80">Complete application assistance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">R150</p>
                    <p className="text-sm text-white/80">one-time fee</p>
                  </div>
                </div>
                <Button
                  onClick={() => setCurrentPage('contact')}
                  className="w-full bg-white text-[#FF6B35] hover:bg-white/90 font-semibold"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Us for Help
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Remark & Supplementary */}
        {currentPage === 'remark' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <FileText className="w-20 h-20 text-[#F5B041] mx-auto mb-4" />
              <h2 className="text-5xl font-bold text-white mb-4">Remark & Supplementary Exams</h2>
              <p className="text-xl text-white/80">Second chances and exam reviews</p>
            </div>

            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/95 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#0F4C5C]">Remark Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    If you believe your exam was marked incorrectly, you can apply for a remark within the deadline.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#0F4C5C]">Important Information:</h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Deadline: Usually 2-3 weeks after results</li>
                      <li>• Cost: Approximately R185 per subject</li>
                      <li>• Apply through your school</li>
                      <li>• Results take 4-6 weeks</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> Marks can go up or down after remarking
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/95 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#0F4C5C]">Supplementary Exams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">
                    Failed some subjects? You can write supplementary exams in February/March.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#0F4C5C]">Eligibility:</h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Failed 1-2 subjects only</li>
                      <li>• At least 40% in failed subjects</li>
                      <li>• Register through your school</li>
                      <li>• Exams in February/March</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Important:</strong> Supplementary results come out in April
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-[#0F4C5C] to-[#1a5f71] text-white shadow-2xl">
              <CardHeader>
                <CardTitle className="text-3xl">Supplementary Exam Crash Course</CardTitle>
                <CardDescription className="text-white/90 text-lg">Intensive preparation for supplementary exams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-white/90 text-lg">
                  Our intensive crash course helps you prepare thoroughly for your supplementary exams, focusing on the topics you struggled with.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#F5B041] text-lg">What's Included:</h4>
                    <ul className="text-white/90 space-y-1">
                      <li>✓ Daily intensive lessons</li>
                      <li>✓ Past paper practice</li>
                      <li>✓ One-on-one support</li>
                      <li>✓ Exam techniques & tips</li>
                      <li>✓ Study materials provided</li>
                      <li>✓ Small class sizes</li>
                    </ul>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="p-6 bg-white/20 rounded-lg text-center mb-4">
                      <p className="text-white/80 mb-2">Course Fee</p>
                      <p className="text-5xl font-bold text-[#F5B041]">R3,500</p>
                      <p className="text-sm text-white/80 mt-2">2-week intensive course</p>
                    </div>
                    <Button
                      onClick={() => setCurrentPage('contact')}
                      className="w-full bg-[#F5B041] hover:bg-[#F5B041]/90 text-[#0F4C5C] font-semibold"
                      size="lg"
                    >
                      Register for Crash Course
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
{/* Matric Results */}
        {currentPage === 'matric-results' && (
          <div className="max-w-5xl mx-auto px-4 py-10">
            <Card className="bg-white/95 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0F4C5C]">
                  🎉 Congratulations Class of 2025!
                </CardTitle>
                <CardDescription>
                 Congratulations to learners from every corner of South Africa! Your dedication and hard work have paid off — let’s take the next steps together toward your future.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* STEP 1 */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg text-[#0F4C5C] mb-2">
                    Step 1: Understand Your Results
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    First, understand what your results mean and what you qualify for.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setCurrentPage('aps-calculator')} className="btn-primary">
                      🧮 Calculate My APS
                    </button>
                    <button onClick={() => setCurrentPage('university-checker')} className="btn-outline">
                      🎓 Check What I Can Study
                    </button>
                  </div>
                </div>

                {/* STEP 2 */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg text-[#0F4C5C] mb-2">
                    Step 2: Apply for Studies
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Late applications are still open at some universities and TVET colleges.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setCurrentPage('university-checker')} className="btn-primary">
                      🎓 University Options
                    </button>
                    <a href="/tvet-colleges" className="btn-outline">
                      🏫 Apply to TVET Colleges
                    </a>
                  </div>
                </div>

                {/* STEP 3 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg text-[#0F4C5C] mb-2">
                    Step 3: Funding & Support
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://www.nsfas.org.za"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      💰 Check NSFAS Status
                    </a>
                    <Link href="/bursaries" className="btn-outline">
                      💼 Bursaries & Support
                    </Link>
                  </div>
                </div>

                {/* STEP 4 */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg text-[#0F4C5C] mb-2">
                    Step 4: Not Happy With Your Results?
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <Link href="/remarking" className="btn-outline">
                      🔁 Remark / Recheck Results
                    </Link>
                    <Link href="/supplementary-exams" className="btn-outline">
                      📝 Supplementary Exams
                    </Link>
                  </div>
                </div>

                {/* LOCAL SUPPORT */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-[#0F4C5C] mb-2">
                    Nkangala & KwaMhlanga Learners
                  </h4>
                  <p className="text-sm text-gray-700">
                    Local guidance for KwaMhlanga (1022), Siyabuswa, Moloto & surrounding Nkangala areas. No learner names are published.
                  </p>
                </div>

                {/* DBE */}
                <div className="bg-blue-100 border border-blue-300 rounded-xl p-6">
                  <a
                    href="https://www.education.gov.za/MatricResults/ExamResults.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Official DBE Matric Results →
                  </a>
                </div>

                {/* DISCLAIMER */}
                <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-xs text-gray-600">
                  <strong>Disclaimer:</strong> TheCurveF is not affiliated with DBE.
                  Results are official only via DBE or schools.
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      {/* Floating WhatsApp Button */}
<a
  href="https://wa.me/23058115977"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 z-50"
>
  WhatsApp
</a>


      {/* Footer */}
      <footer className="bg-[#0F4C5C]/90 border-t border-[#F5B041]/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/80">
            <p className="mb-2">© 2025 TheCurveF (Pty) Ltd. All rights reserved.</p>
            <p className="text-sm">Empowering KwaNdebele learners since 2017</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://www.facebook.com/TheCurveF" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5B041]">
                Facebook
              </a>
              <span>•</span>
              <a href="https://wa.me/23058115977" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5B041]">
                WhatsApp
              </a>
              <span>•</span>
              <a href="mailto:Info@thecurvef.co.za" className="hover:text-[#F5B041]">
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
