import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import {
  User, Award, Clock, CheckCircle, Copy, ExternalLink, Star, BookOpen,
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface UserProfile {
  name: string;
  reputation: number;
  nftCount: number;
  completedSessions: number;
  joinedAt: string;
}

interface CompletedSession {
  id: string;
  skillExchanged: string;
  partner: string;
  completedAt: string;
  nftEarned: boolean;
}

interface ActiveSession {
  id: string;
  skillA: string;
  skillB: string;
  partner: string;
  status: 'in-progress' | 'pending-confirmation';
  progress: number;
}

// ---- This interface should match your backend Course entity structure ----
interface Course {
  id: number | string;
  title: string;
  category: string;
  level: string;
  type: string;
  location: string;
  description: string;
  // Add other relevant fields as needed!
}

const Profile = () => {
  const { account, isConnected, connectWallet, balance } = useWallet();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Mock data for demonstration (still used for other profile info)
  const mockProfile: UserProfile = {
    name: 'Alex Developer',
    reputation: 4.8,
    nftCount: 7,
    completedSessions: 12,
    joinedAt: '2024-01-01'
  };

  const mockCompletedSessions: CompletedSession[] = [
    {
      id: '1',
      skillExchanged: 'React Development ↔ UI/UX Design',
      partner: 'Sarah Chen',
      completedAt: '2024-01-15',
      nftEarned: true
    },
    {
      id: '2',
      skillExchanged: 'Python Data Analysis ↔ Machine Learning',
      partner: 'Mike Johnson',
      completedAt: '2024-01-10',
      nftEarned: true
    },
    {
      id: '3',
      skillExchanged: 'Spring Boot ↔ Database Design',
      partner: 'Lisa Wang',
      completedAt: '2024-01-05',
      nftEarned: true
    }
  ];

  const mockActiveSessions: ActiveSession[] = [
    {
      id: '4',
      skillA: 'Node.js Development',
      skillB: 'DevOps Practices',
      partner: 'Emma Wilson',
      status: 'in-progress',
      progress: 60
    },
    {
      id: '5',
      skillA: 'GraphQL APIs',
      skillB: 'Frontend Testing',
      partner: 'David Kim',
      status: 'pending-confirmation',
      progress: 90
    }
  ];

  // Fetch owned courses on wallet connect
  useEffect(() => {
    const fetchProfileAndCourses = async () => {
      setLoading(true);
      if (isConnected && account) {
        try {
          // Fetch courses for this wallet address
          setCoursesLoading(true);
          const coursesResp = await axios.get(
            `http://localhost:8080/api/courses/owner/${account}`
          );
          setMyCourses(
            Array.isArray(coursesResp.data) ? coursesResp.data : []
          );
        } catch (error) {
          toast({
            title: "Error",
            description: "Could not load your courses.",
            variant: "destructive"
          });
          setMyCourses([]);
        } finally {
          setCoursesLoading(false);
        }

        // Mock profile/activity data (replace with your real API)
        // const response = await axios.get(`.../api/profile/${account}`)
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
        setProfile(mockProfile);
        setCompletedSessions(mockCompletedSessions);
        setActiveSessions(mockActiveSessions);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchProfileAndCourses();
    // Only refetch if account changes or connect state changes
  }, [isConnected, account]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard.",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const generateNFTBadge = (reputation: number) => {
    const badgeColor = reputation >= 4.5 ? '#10B981' : reputation >= 4.0 ? '#F59E0B' : '#EF4444';
    const badgeText = reputation >= 4.5 ? 'EXPERT' : reputation >= 4.0 ? 'SKILLED' : 'LEARNER';
    return (
      <div className="relative w-24 h-24 mx-auto">
        <svg width="96" height="96" viewBox="0 0 96 96" className="drop-shadow-lg">
          <defs>
            <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: badgeColor, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: badgeColor, stopOpacity: 0.7 }} />
            </linearGradient>
          </defs>
          <circle cx="48" cy="48" r="40" fill="url(#badgeGradient)" stroke="#fff" strokeWidth="3" />
          <text x="48" y="45" textAnchor="middle" className="text-[10px] font-bold fill-white">
            {badgeText}
          </text>
          <text x="48" y="58" textAnchor="middle" className="text-[8px] fill-white">
            {reputation.toFixed(1)}
          </text>
        </svg>
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 web3-gradient rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SkillXchange</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/explore" className="text-foreground hover:text-primary transition-colors">
                Explore Skills
              </Link>
              <Link to="/post" className="text-foreground hover:text-primary transition-colors">
                Post Skill
              </Link>
            </nav>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <User className="w-6 h-6" />
                  Connect Your Wallet
                </CardTitle>
                <CardDescription>
                  Connect your Web3 wallet to view your profile and track your skill exchanges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={connectWallet} className="web3-button">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 web3-gradient rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">SkillXchange</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-foreground hover:text-primary transition-colors">
              Explore Skills
            </Link>
            <Link to="/post" className="text-foreground hover:text-primary transition-colors">
              Post Skill
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 card-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  {profile && generateNFTBadge(profile.reputation)}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold mb-2">{profile?.name}</h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{profile?.reputation}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="secondary">
                      {profile?.nftCount} NFTs Earned
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {account && formatAddress(account)}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => account && copyToClipboard(account)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Balance</p>
                      <p className="font-medium">{parseFloat(balance).toFixed(4)} ETH</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completed</p>
                      <p className="font-medium">{profile?.completedSessions} Sessions</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Member Since</p>
                      <p className="font-medium">{profile?.joinedAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MY COURSES SECTION */}
          <Card className="mb-8 card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen />
                Your Courses
              </CardTitle>
              <CardDescription>
                Here are the courses that you are currently hosting as a teacher or offering to others.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <div className="text-center py-4">Loading your courses...</div>
              ) : myCourses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="mb-2 text-muted-foreground">You are not hosting any courses yet.</p>
                  <Link to="/post">
                    <Button className="web3-button">
                      Post a Skill
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myCourses.map(course => (
                    <Card key={course.id} className="mb-2 skill-card">
                      <CardHeader>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{course.category}</Badge>
                            <Badge variant="outline">{course.level}</Badge>
                            <Badge variant="outline">{course.type}</Badge>
                            <Badge variant="outline">{course.location}</Badge>
                          </div>
                          <CardTitle>{course.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-2 text-sm line-clamp-3">{course.description}</p>
                        <Link to={`/courses/${course.id}`}>
                          <Button size="sm" variant="outline" className="w-full">
                            View Course
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Sessions</TabsTrigger>
              <TabsTrigger value="completed">Completed Sessions</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeSessions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your first skill exchange to see it here.
                    </p>
                    <Link to="/explore">
                      <Button className="web3-button">
                        Explore Skills
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                activeSessions.map((session) => (
                  <Card key={session.id} className="skill-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {session.skillA} ↔ {session.skillB}
                          </CardTitle>
                          <CardDescription>
                            with {session.partner}
                          </CardDescription>
                        </div>
                        <Badge variant={session.status === 'in-progress' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-muted-foreground">
                              {session.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${session.progress}%` }}
                            />
                          </div>
                        </div>
                        <Link to={`/session/${session.id}`}>
                          <Button className="w-full" variant="outline">
                            View Session
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedSessions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Completed Sessions</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete your first skill exchange to earn your reputation NFT.
                    </p>
                    <Link to="/explore">
                      <Button className="web3-button">
                        Find Your First Match
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                completedSessions.map((session) => (
                  <Card key={session.id} className="skill-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {session.skillExchanged}
                          </CardTitle>
                          <CardDescription>
                            with {session.partner} • {session.completedAt}
                          </CardDescription>
                        </div>
                        {session.nftEarned && (
                          <Badge className="bg-green-100 text-green-800">
                            <Award className="w-3 h-3 mr-1" />
                            NFT Earned
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">
                          Session completed successfully
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
