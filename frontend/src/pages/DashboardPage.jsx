import { BrainCircuit, FileText, LogOut, MessageSquareText, WandSparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import AppShell from '../components/layout/AppShell';


function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="400" height="400" fill="%23050508" filter="url(%23noiseFilter)" opacity="0.03"/%3E%3C/svg%3E")',
        backgroundSize: '200px 200px',
        opacity: 0.4,
        zIndex: 1,
      }}
    />
  );
}

function useMagneticButton() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const onMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Only trigger if within reasonable distance
    const distance = Math.sqrt(x * x + y * y);
    if (distance < 100) {
      setMousePosition({
        x: x * 0.2,
        y: y * 0.2,
      });
    }
  };

  const onMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return { ref, mousePosition, onMouseMove, onMouseLeave };
}

// Typing animation component
function TypingAnimation({ text, delay = 0 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    let timer;

    // Wait for delay before starting
    const delayTimer = setTimeout(() => {
      const type = () => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
          timer = setTimeout(type, 100); // 100ms per character
        } else {
          setIsComplete(true);
        }
      };
      type();
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(timer);
    };
  }, [text, delay]);

  return (
    <>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </>
  );
}

// Tilt card component with mouse tracking
function TiltCard({ children, delay }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y - rect.height / 2) / 10;
    const rotateY = (x - rect.width / 2) / 10;

    setRotation({ x: -rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      viewport={{ once: true, margin: '-100px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

// Magnetic button component
function MagneticButton({ onClick, children, className, ...props }) {
  const { ref, mousePosition, onMouseMove, onMouseLeave } = useMagneticButton();

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      onClick={onClick}
      className={className}
      type="button"
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('datastory_user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('datastory_token');
    localStorage.removeItem('datastory_user');
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <AppShell>
      <GrainOverlay />
      <div className="relative flex-1 overflow-hidden" style={{ backgroundColor: '#050508' }}>
        {/* Hero Section */}
        <section className="relative min-h-screen w-full overflow-hidden px-4 py-32 sm:px-6 lg:px-8" style={{ backgroundColor: '#050508' }}>
          {/* Accent line */}
          <div className="absolute left-0 top-20 h-px w-32 bg-gradient-to-r from-cyan-500 via-transparent to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: '#06B6D4' }}
            >
              DataStory AI
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-6 text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-7xl"
              style={{ letterSpacing: '-0.02em' }}
            >
              <TypingAnimation text="Turn raw files into explainable stories!" delay={500} />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="mt-8 max-w-2xl text-lg leading-relaxed"
              style={{ color: '#94A3B8' }}
            >
              Upload datasets, ask natural-language questions, and get narrative insights with charts that help teams decide faster.
            </motion.p>

            {user ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="mt-6 text-sm font-medium"
                style={{ color: '#06B6D4' }}
              >
                Welcome back, {user.fullName}.
              </motion.p>
            ) : null}
          </motion.div>

          {/* Accent line bottom right */}
          <div className="absolute bottom-20 right-0 h-px w-32 bg-gradient-to-l from-violet-500 via-transparent to-transparent" />
        </section>

        {/* Features Section */}
        <section
          className="relative w-full overflow-hidden px-4 py-32 sm:px-6 lg:px-8"
          style={{ backgroundColor: '#0a0a0e' }}
        >
          {/* Accent line */}
          <div className="absolute left-0 top-10 h-px w-40 bg-gradient-to-r from-emerald-500 via-transparent to-transparent" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="relative z-10 mx-auto max-w-6xl"
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-black tracking-tight text-white sm:text-5xl"
              style={{ letterSpacing: '-0.02em' }}
            >
              What DataStory AI can do
            </motion.h2>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: FileText,
                  title: 'Smart file understanding',
                  description: 'Ingest CSV, Excel, and documents to extract structure, metadata, and key business signals.',
                  accentColor: '#10B981',
                },
                {
                  icon: MessageSquareText,
                  title: 'Ask data in plain English',
                  description: 'Use AI chat to ask for summaries, trends, outliers, and actionable explanations instantly.',
                  accentColor: '#0EA5E9',
                },
                {
                  icon: BrainCircuit,
                  title: 'Generate data stories',
                  description: 'Create concise narratives and chart-ready insights for reports, dashboards, and presentations.',
                  accentColor: '#A78BFA',
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <TiltCard key={index} delay={index * 0.15}>
                    <div
                      className="group relative h-full rounded-2xl border p-8 backdrop-blur-sm transition-all duration-300"
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        borderColor: feature.accentColor,
                        borderWidth: '1px',
                        boxShadow: `0 0 20px rgba(${
                          feature.accentColor === '#10B981'
                            ? '16, 185, 129'
                            : feature.accentColor === '#0EA5E9'
                              ? '14, 165, 233'
                              : '167, 139, 250'
                        }, 0.1)`,
                      }}
                    >
                      {/* Glowing border on hover */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(circle at center, ${feature.accentColor}15, transparent)`,
                        }}
                      />

                      <div className="relative z-10">
                        <div
                          className="inline-flex rounded-lg p-3 backdrop-blur-sm"
                          style={{
                            backgroundColor: `${feature.accentColor}15`,
                          }}
                        >
                          <Icon size={24} style={{ color: feature.accentColor }} aria-hidden="true" />
                        </div>
                        <h3 className="mt-6 text-xl font-bold tracking-tight text-white">{feature.title}</h3>
                        <p className="mt-4 text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Actions Section */}
        <section className="relative w-full overflow-hidden px-4 py-32 sm:px-6 lg:px-8" style={{ backgroundColor: '#050508' }}>
          {/* Accent lines */}
          <div className="absolute bottom-40 right-0 h-px w-40 bg-gradient-to-l from-pink-500 via-transparent to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-100px' }}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
              Quick actions
            </h2>

            <div className="mt-10 flex flex-wrap gap-4 sm:gap-6">
              {[
                {
                  label: 'Go to Files',
                  icon: FileText,
                  onClick: () => navigate('/files'),
                  accentColor: '#06B6D4',
                  bgColor: '#06B6D4',
                },
                {
                  label: 'Open AI Chat',
                  icon: WandSparkles,
                  onClick: () => navigate('/chat'),
                  accentColor: '#8B5CF6',
                  bgColor: 'transparent',
                  border: true,
                },
                {
                  label: 'Logout',
                  icon: LogOut,
                  onClick: handleLogout,
                  accentColor: '#EF4444',
                  bgColor: 'transparent',
                  border: true,
                },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <MagneticButton
                    key={index}
                    onClick={action.onClick}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300 backdrop-blur-sm"
                    style={{
                      backgroundColor: action.bgColor === 'transparent' ? 'rgba(15, 23, 42, 0.8)' : action.bgColor,
                      border: action.border ? `2px solid ${action.accentColor}` : 'none',
                      color: action.bgColor === 'transparent' ? action.accentColor : 'white',
                    }}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {action.label}

                    {/* Glowing effect */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 blur transition-opacity duration-300 group-hover:opacity-50"
                      style={{
                        backgroundColor: action.accentColor,
                        zIndex: -1,
                      }}
                    />
                  </MagneticButton>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Footer accent line */}
        <div className="relative h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>
    </AppShell>
  );
}
