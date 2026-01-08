'use client'

import Link from "next/link";


import Image from 'next/image';
import { useState } from 'react'
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
  const [currentPage, setCurrentPage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const menuItems = [
    { id: 'home', label: 'Home', icon: <School className="w-4 h-4" /> },
    { id: 'past-papers', label: 'Past Papers', icon: <FileText className="w-4 h-4" /> },
    { id: 'aps-calculator', label: 'APS Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'university-checker', label: 'University Checker', icon: <School className="w-4 h-4" /> },
    { id: 'nbt-practice', label: 'NBT Practice', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'matric-results', label: 'Matric Results', icon: <Award className="w-4 h-4" /> },
    { id: 'book-tutor', label: 'Book Tutor', icon: <Users className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
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

// University of Pretoria
if (aps >= 34) programmes.push({
  uni: 'UP',
  programme: 'BSc Computer Science',
  minAps: 34,
  url: 'https://www.up.ac.za/online-application'
})

if (aps >= 32) programmes.push({
  uni: 'UP',
  programme: 'BCom Accounting',
  minAps: 32,
  url: 'https://www.up.ac.za/online-application'
})

if (aps >= 30) programmes.push({
  uni: 'UP',
  programme: 'BA Law',
  minAps: 30,
  url: 'https://www.up.ac.za/online-application'
})

// University of Johannesburg
if (aps >= 33) programmes.push({
  uni: 'UJ',
  programme: 'BCom Economics',
  minAps: 33,
  url: 'https://apply.uj.ac.za'
})

if (aps >= 30) programmes.push({
  uni: 'UJ',
  programme: 'BSc Engineering',
  minAps: 30,
  url: 'https://apply.uj.ac.za'
})

// TUT
if (aps >= 28) programmes.push({
  uni: 'TUT',
  programme: 'BTech Information Technology',
  minAps: 28,
  url: 'https://www.tut.ac.za/student-portal/application'
})

// UMP
if (aps >= 26) programmes.push({
  uni: 'UMP',
  programme: 'BSc Agriculture',
  minAps: 26,
  url: 'https://www.ump.ac.za/Apply'
})


    setQualifyingProgrammes(programmes)
  }

  const handleFormSubmit = async (formType) => {
    setIsSubmitting(true)
    setFormStatus({ type: '', message: '' })

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType, data: formData })
      })

      const result = await response.json()

      if (response.ok) {
        setFormStatus({ type: 'success', message: result.message || 'Form submitted successfully! We will contact you soon.' })
        setFormData({})
        
        // Open WhatsApp
        const whatsappNum = '+23058115977'
        let message = ''
        if (formType === 'tutor') {
          message = `New Tutor Booking Request:\nName: ${formData.name}\nPhone: ${formData.phone}\nGrade: ${formData.grade}\nSubjects: ${formData.subjects}\nDays/Week: ${formData.daysPerWeek}`
        } else if (formType === 'contact') {
          message = `New Contact Form:\nName: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`
        }
        window.open(`https://wa.me/${whatsappNum.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank')
      } else {
        setFormStatus({ type: 'error', message: result.error || 'Failed to submit form. Please try again.' })
      }
    } catch (error) {
      setFormStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setFormStatus({ type: '', message: '' }), 5000)
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
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition">
  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
    <Image
      src="/images/logo.jpg"
      
      width={48}
      height={48}
      className="object-contain"
      priority
    />
  </div>

  <div>
    <h1 className="text-white font-bold text-xl">TheCurveF</h1>
    <p className="text-[#F5B041] text-xs">
      Education Brought To You In Style
    </p>
  </div>
</Link>


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
        {/* Home Page */}
        {currentPage === 'home' && (
          <div className="space-y-12">
            {/* Hero Section with Ndebele Pattern */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C5C]/95 to-[#0F4C5C]/80 z-10"></div>
              <img
                src="/images/hero-bg.jpg"
                alt="Students studying together"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="container mx-auto px-8">
                  <div className="max-w-3xl">
                    {/* Ndebele Pattern Accent */}
                    <div className="flex space-x-2 mb-6">
                      {[0, 1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className="w-16 h-4 bg-gradient-to-r from-[#F5B041] via-[#FF6B35] to-[#F5B041] rounded-full"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                      ))}
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                      Ace Your Matric.
                      <span className="text-[#F5B041]"> Get Into University.</span>
                    </h1>
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                      Free past papers, APS calculator, expert tutoring, and university preparation for Mpumalanga & Gauteng learners.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        size="lg"
                        onClick={() => setCurrentPage('past-papers')}
                        className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-xl"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Free Past Papers
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => setCurrentPage('book-tutor')}
                        className="bg-[#F5B041] hover:bg-[#F5B041]/90 text-[#0F4C5C] font-semibold px-8 py-6 text-lg rounded-xl shadow-xl"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Book a Tutor
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/95 border-none shadow-xl">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[#FF6B35] mb-2">5000+</div>
                    <p className="text-gray-600 font-medium">Papers Downloaded</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/95 border-none shadow-xl">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[#F5B041] mb-2">8+</div>
                    <p className="text-gray-600 font-medium">Years of Camps</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/95 border-none shadow-xl">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[#0F4C5C] mb-2">500+</div>
                    <p className="text-gray-600 font-medium">Students Helped</p>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                  <CardDescription>Check results on 13 Jan 2026</CardDescription>
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
                    {['UP', 'UJ', 'TUT', 'UMP'].map(uni => {
                      const uniProgrammes = qualifyingProgrammes.filter(p => p.uni === uni)
                      if (uniProgrammes.length === 0) return null
                      return (
                        <Card key={uni} className="border-l-4 border-[#F5B041]">
                          <CardHeader>
                            <CardTitle className="text-xl">
                              {uni === 'UP' && 'University of Pretoria'}
                              {uni === 'UJ' && 'University of Johannesburg'}
                              {uni === 'TUT' && 'Tshwane University of Technology'}
                              {uni === 'UMP' && 'University of Mpumalanga'}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                           <div className="space-y-4">
  {uniProgrammes.map((prog, idx) => (
    <div
      key={idx}
      className="flex items-center justify-between p-4 border rounded-lg"
    >
      <div>
        <p className="font-semibold text-gray-800">
          {prog.programme}
        </p>
        <p className="text-sm text-gray-500">
          Min APS: {prog.minAps}
        </p>
      </div>

      {prog.url && (
        <a
          href={prog.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-md hover:bg-[#e85c2c] transition"
        >
          Apply
        </a>
      )}
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

        {/* Matric Results Checker */}
        {currentPage === 'matric-results' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <Award className="w-20 h-20 text-[#F5B041] mx-auto mb-4" />
              <h2 className="text-5xl font-bold text-white mb-4">Matric Results 2025</h2>
              <p className="text-xl text-white/80">Results will be released on 13 January 2026</p>
            </div>

            <Card className="bg-white/95 shadow-2xl">
  <CardHeader>
    <CardTitle className="text-2xl text-[#0F4C5C]">
      How to Receive Your Matric Results via WhatsApp or SMS
    </CardTitle>
    <CardDescription>
      A simple process to get your results delivered directly to your phone
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6">
    {/* Steps */}
    <div className="bg-gradient-to-br from-[#F5B041]/20 to-[#FF6B35]/20 p-6 rounded-xl">
      <h3 className="font-semibold text-lg text-[#0F4C5C] mb-3">
        Follow These Easy Steps
      </h3>

      <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
        <li>Apply using the official form below</li>
        <li>Enter your correct exam details and phone number</li>
        <li>Receive your matric results via WhatsApp or SMS on results day</li>
      </ol>

      <p className="mt-4 font-semibold text-[#FF6B35]">
        📌 Applications are currently ongoing
      </p>

      <a
        href="https://tinyurl.com/atwc7kbd"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e85c2c] transition"
      >
        Apply Here →
      </a>
    </div>

    {/* Important Notes */}
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <h4 className="font-semibold text-[#0F4C5C] mb-3">
        Important Notes
      </h4>

      <ul className="text-sm text-gray-700 space-y-2">
        <li>• Results are released in January</li>
        <li>• Ensure your phone number is active and correct</li>
        <li>• This service helps you avoid queues and delays</li>
        <li>• Official DBE results still apply</li>
      </ul>

      {/* DBE Link */}
      <div className="mt-4">
        <p className="text-sm text-gray-700 mb-2 font-medium">
          Check results directly from the Department of Basic Education:
        </p>

        <a
          href="https://www.education.gov.za/MatricResults/ExamResults.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0F4C5C] font-semibold underline hover:text-[#FF6B35]"
        >
          Official DBE Matric Results Portal →
        </a>

        <p className="text-xs text-gray-600 mt-2">
          Enter your examination number to view and verify your results.
        </p>
      </div>
    </div>

    {/* Disclaimer */}
    <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-xs text-gray-600">
      <strong>Disclaimer:</strong> The WhatsApp/SMS results service is provided
      for convenience only. TheCurveF is not affiliated with the Department of
      Basic Education (DBE). All matric results are official only when confirmed
      via the DBE website or your school.
    </div>
  </CardContent>
</Card>


          </div>
        )}

        {/* Book Tutor Form */}
        {currentPage === 'book-tutor' && (
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
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tutor-grade" className="text-gray-700 font-medium">
                    Grade *
                  </Label>
                  <Select
                    value={formData.grade || ''}
                    onValueChange={(value) => setFormData({ ...formData, grade: value })}
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
                    value={formData.subjects || ''}
                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
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
                    value={formData.daysPerWeek || ''}
                    onValueChange={(value) => setFormData({ ...formData, daysPerWeek: value })}
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

                {formStatus.message && (
                  <div
                    className={`p-4 rounded-lg flex items-start space-x-3 ${
                      formStatus.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {formStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <p
                      className={`text-sm ${
                        formStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {formStatus.message}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => handleFormSubmit('tutor')}
                  disabled={isSubmitting || !formData.name || !formData.phone || !formData.grade || !formData.subjects || !formData.daysPerWeek}
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
                    id="contact-name"
                    placeholder="Enter your full name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact-phone" className="text-gray-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contact-message" className="text-gray-700 font-medium">
                    Message *
                  </Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message || ''}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1"
                    rows={5}
                    required
                  />
                </div>

                {formStatus.message && (
                  <div
                    className={`p-4 rounded-lg flex items-start space-x-3 ${
                      formStatus.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {formStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <p
                      className={`text-sm ${
                        formStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {formStatus.message}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => handleFormSubmit('contact')}
                  disabled={isSubmitting || !formData.name || !formData.phone || !formData.message}
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
                  <p className="text-gray-600">Ntashkills@gmail.com</p>
                </CardContent>
              </Card>
            </div>
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
              <a href="mailto:Ntashkills@gmail.com" className="hover:text-[#F5B041]">
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
