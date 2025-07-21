import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Star, MapPin, Clock, Tag } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Skill {
  id: string | number;
  title: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'teach' | 'learn';
  location: 'remote' | 'in-person';
  duration: string;
  description: string;
  ownerWalletAddress?: string;
  fees?: number | null | string;
  user?: {
    name: string;
    reputation: number;
    verified: boolean;
  };
  createdAt: string;
}

const ExploreSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/courses');
        let skillsData = response.data as Skill[];
        // If your API returns a wrapped structure, update as needed!
        setSkills(skillsData);
        setFilteredSkills(skillsData);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        setSkills([]);
        setFilteredSkills([]);
      }
      setIsLoading(false);
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    let filtered = [...skills];
    if (searchTerm) {
      filtered = filtered.filter(skill =>
        (skill.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (skill.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }
    if (typeFilter !== 'all') {
      filtered = filtered.filter(skill => skill.type === typeFilter);
    }
    if (locationFilter !== 'all') {
      filtered = filtered.filter(skill => skill.location === locationFilter);
    }
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'reputation':
        filtered.sort((a, b) => (b.user?.reputation || 0) - (a.user?.reputation || 0));
        break;
      case 'verified':
        filtered.sort((a, b) => ((b.user?.verified ? 1 : 0) - (a.user?.verified ? 1 : 0)));
        break;
      default:
        break;
    }
    setFilteredSkills(filtered);
  }, [skills, searchTerm, typeFilter, locationFilter, sortBy]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'teach' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const showFree = (fees: any) => {
    // Handle number/string/null/undefined
    return !fees || Number(fees) === 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 web3-gradient rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">SkillXchange</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/post" className="text-foreground hover:text-primary transition-colors">
              Post Skill
            </Link>
            <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Type</h3>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="teach">Teach</SelectItem>
                  <SelectItem value="learn">Learn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Location</h3>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="in-person">In-person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="reputation">Best Reputation</SelectItem>
                  <SelectItem value="verified">Verified Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </aside>

          {/* Skills Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Explore Skills</h1>
              <p className="text-muted-foreground">{filteredSkills.length} skills found</p>
            </div>

            {isLoading ? (
              <div className="w-full py-12 text-center text-muted-foreground">Loading skills...</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredSkills.map((skill) => (
                  <Card key={skill.id} className="skill-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex gap-1 flex-wrap mb-2">
                            <Badge className={getLevelColor(skill.level)}>{skill.level}</Badge>
                            <Badge className={getTypeColor(skill.type)}>{skill.type}</Badge>
                            {showFree(skill.fees) && (
                              <Badge className="bg-green-50 text-green-600 border-green-100 flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                Free
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg mb-2">{skill.title}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">{skill.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {skill.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {skill.location}
                          </div>
                          {/* Fees display if not free */}
                          {!showFree(skill.fees) && (
                            <div className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              {typeof skill.fees === 'number' || (typeof skill.fees === 'string' && skill.fees !== '') 
                                ? `₹${skill.fees}` 
                                : ''}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {skill.user?.name ? skill.user.name[0] : '?'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{skill.user?.name ?? "Course Owner"}</p>
                              {skill.user && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{skill.user.reputation}</span>
                                  {skill.user.verified && (
                                    <Badge variant="secondary" className="text-xs">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link to={`/match?skill=${skill.id}`}>
                          <Button className="w-full web3-button">
                            Connect
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ExploreSkills;
