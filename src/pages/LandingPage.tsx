import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift, Shield, Zap, CreditCard, TrendingUp, Users, Award, Star, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

const BADGES = [
  { id: 'b1', name: '7-Day Streak', icon: '🔥', rarity: 'common', description: 'Check in for 7 consecutive days' },
  { id: 'b2', name: 'First Steps', icon: '🌟', rarity: 'common', description: 'Earn your first 100 points' },
  { id: 'b3', name: 'Savings Star', icon: '⭐', rarity: 'rare', description: 'Save ₹5000 in your savings account' },
  { id: 'b4', name: 'Budget Ninja', icon: '🥷', rarity: 'epic', description: 'Reach Level 3' },
  { id: 'b5', name: 'Quest Master', icon: '🏆', rarity: 'legendary', description: 'Complete 5 quests' },
  { id: 'b6', name: '30-Day Champion', icon: '👑', rarity: 'legendary', description: 'Maintain a 30-day check-in streak' },
];

const LEVELS = [
  { level: 1, name: 'Rookie Saver', minPoints: 0, maxPoints: 499, color: 'from-gray-400 to-gray-600' },
  { level: 2, name: 'Smart Spender', minPoints: 500, maxPoints: 1499, color: 'from-blue-400 to-blue-600' },
  { level: 3, name: 'Budget Ninja', minPoints: 1500, maxPoints: 2999, color: 'from-green-400 to-green-600' },
  { level: 4, name: 'Financial Wizard', minPoints: 3000, maxPoints: 4999, color: 'from-purple-400 to-purple-600' },
  { level: 5, name: 'Money Master', minPoints: 5000, maxPoints: 7499, color: 'from-pink-400 to-pink-600' },
  { level: 6, name: 'Wealth Builder', minPoints: 7500, maxPoints: 9999, color: 'from-orange-400 to-orange-600' },
  { level: 7, name: 'Finance Guru', minPoints: 10000, maxPoints: 14999, color: 'from-red-400 to-red-600' },
  { level: 8, name: 'Legendary Saver', minPoints: 15000, maxPoints: Infinity, color: 'from-yellow-400 to-yellow-600' },
];

const getRarityStyles = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'border-gray-300 bg-gray-50 text-gray-600';
    case 'rare':
      return 'border-blue-300 bg-blue-50 text-blue-600';
    case 'epic':
      return 'border-purple-300 bg-purple-50 text-purple-600';
    case 'legendary':
      return 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 text-yellow-700';
    default:
      return 'border-gray-300 bg-gray-50 text-gray-600';
  }
};

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Logo size="md" />
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-700 transition-colors">Features</a>
              <a href="#badges" className="text-gray-600 hover:text-green-700 transition-colors">Badges</a>
              <a href="#tiers" className="text-gray-600 hover:text-green-700 transition-colors">Tiers</a>
            </div>
            <div>
              <Link to="/login">
                <Button className="bg-green-700 hover:bg-green-800 text-white rounded-full px-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 font-medium text-sm">
              🚀 The Future of Banking Loyalty
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              Banking that <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Rewards You</span> for Every Move
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience a loyalty program designed for your lifestyle. Earn points on transactions, savings, and referrals. Redeem for what matters to you.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-6 rounded-full">
                  Existing Member?
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image / Graphic */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white p-2">
               <div className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-white aspect-[16/9] flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-10"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 w-full max-w-4xl z-10">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-gray-900">Smart Spending</h3>
                      <p className="text-sm text-gray-500 mt-2">Earn 2x points on dining and travel expenses automatically.</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center md:-mt-8"
                    >
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                        <Gift className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-gray-900">Instant Rewards</h3>
                      <p className="text-sm text-gray-500 mt-2">Redeem points instantly for cash back, gift cards, or charity.</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center"
                    >
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-teal-600">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-gray-900">Tier Growth</h3>
                      <p className="text-sm text-gray-500 mt-2">Unlock exclusive benefits as you level up your membership.</p>
                    </motion.div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Simple steps to maximize your banking benefits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>

            {[
              { icon: Users, title: "Join & Connect", desc: "Sign up in seconds and link your accounts securely." },
              { icon: Zap, title: "Transact & Earn", desc: "Use your card for daily purchases and watch points grow." },
              { icon: Gift, title: "Redeem & Enjoy", desc: "Spend points on a wide range of curated rewards." }
            ].map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative z-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center group hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                  <step.icon className="h-8 w-8 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Badges Showcase Section */}
      <section id="badges" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-4">
              <Award className="h-4 w-4" />
              Collect & Showcase
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Earn Exclusive Badges</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Complete challenges and unlock beautiful badges to show off your financial achievements.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {BADGES.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative p-6 rounded-2xl border-2 ${getRarityStyles(badge.rarity)} shadow-lg hover:shadow-xl transition-all cursor-pointer group`}
              >
                {badge.rarity === 'legendary' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(234, 179, 8, 0.3)',
                        '0 0 40px rgba(234, 179, 8, 0.5)',
                        '0 0 20px rgba(234, 179, 8, 0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <div className="text-center">
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
                    {badge.icon}
                  </div>
                  <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                  <p className="text-xs opacity-75 line-clamp-2">{badge.description}</p>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wide opacity-60">
                    {badge.rarity}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Timeline Section */}
      <section id="tiers" className="py-24 bg-gradient-to-br from-gray-50 to-green-50/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-4">
              <Trophy className="h-4 w-4" />
              Level Up Your Journey
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Membership Tiers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Progress through 8 exciting levels and unlock increasingly valuable rewards and perks.</p>
          </motion.div>

          <div className="relative">
            {/* Timeline connector */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 via-green-400 to-yellow-400 transform -translate-x-1/2"></div>

            <div className="space-y-8">
              {LEVELS.map((level, index) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col lg:flex-row items-center gap-6 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-green-200 transition-all inline-block w-full lg:w-auto"
                    >
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${level.color} text-white text-xs font-bold mb-3`}>
                        <Star className="h-3 w-3" />
                        Level {level.level}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{level.name}</h3>
                      <p className="text-gray-600">
                        {level.maxPoints === Infinity 
                          ? `${level.minPoints.toLocaleString()}+ points` 
                          : `${level.minPoints.toLocaleString()} - ${level.maxPoints.toLocaleString()} points`}
                      </p>
                    </motion.div>
                  </div>

                  <div className="hidden lg:block relative z-10">
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${level.color} border-4 border-white shadow-lg flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-xl">{level.level}</span>
                    </motion.div>
                  </div>

                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                More than just points. <br />
                <span className="text-green-700">It's a lifestyle.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our loyalty program is built to adapt to your financial habits. Whether you're a frequent traveler, a foodie, or a saver, we have rewards that match your profile.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Real-time Tracking", desc: "See your points balance update instantly after every transaction." },
                  { title: "Family Pooling", desc: "Combine points with family members to reach goals faster." },
                  { title: "No Expiration", desc: "Your hard-earned points never expire as long as you're active." }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <Shield className="h-3.5 w-3.5 text-green-700" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-emerald-200 rounded-3xl transform rotate-3 opacity-30"></div>
              <div className="relative bg-gray-900 rounded-3xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-green-500 rounded-full blur-3xl opacity-20"></div>
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wider">Total Balance</p>
                    <h3 className="text-3xl font-bold text-white">24,500 <span className="text-green-400 text-lg">PTS</span></h3>
                  </div>
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                    <Zap className="text-yellow-400 h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "Starbucks Coffee", points: "+150", time: "2 mins ago" },
                    { name: "Uber Ride", points: "+320", time: "2 hours ago" },
                    { name: "Grocery Store", points: "+850", time: "Yesterday" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                          <CreditCard className="h-5 w-5 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-gray-400 text-xs">{item.time}</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold">{item.points}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-700">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Next Reward</span>
                      <span className="text-white">85%</span>
                   </div>
                   <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 w-[85%]"></div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-900 relative overflow-hidden">
        <div className="absolute inset-0">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-800 rounded-full blur-3xl opacity-50"></div>
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to start earning?</h2>
          <p className="text-green-100 text-xl mb-10">Join thousands of members who are already enjoying exclusive rewards and benefits.</p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-green-900 hover:bg-gray-100 text-lg px-10 py-6 rounded-full font-bold shadow-xl">
              Create Free Account
            </Button>
          </Link>
          <p className="mt-6 text-green-200/60 text-sm">No credit card required for sign up.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo size="md" />
            <p className="text-gray-500 text-sm mt-2">© 2024 GlaBank Loyalty. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-600">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-gray-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
