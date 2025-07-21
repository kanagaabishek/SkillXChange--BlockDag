import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import axios from 'axios';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/courses/${id}`)
      .then(resp => setCourse(resp.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = async () => {
    if (!window.ethereum) {
      alert('MetaMask required!');
      return;
    }
    try {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const valueEth = Number(course.fees || 0);
      const valueWei = (valueEth * 1e18).toString(16);
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: course.ownerWalletAddress,
          value: valueWei
        }]
      });
      setPaymentComplete(true);
      setTimeout(() => {
        navigate(`/match?skill=${course.id}`);
      }, 1200);
    } catch (err) {
      alert('Payment failed or rejected.');
    }
  };

  const handleCopy = () => {
    if (course && course.zoomLink) {
      navigator.clipboard.writeText(course.zoomLink);
      alert('Zoom link copied!');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-3">{course.title}</h1>
      <div className="flex gap-2 mb-2">
        <Badge>{course.category}</Badge>
        <Badge>{course.level}</Badge>
        <Badge>{course.type}</Badge>
      </div>
      <p className="mb-2">{course.description}</p>
      <div className="mb-4">Duration: {course.duration}</div>
      <div className="mb-4">
        Fees: {(!course.fees || Number(course.fees) === 0) ? 
          <Badge className="bg-green-100 text-green-800">Free</Badge> : 
          <span className="font-bold text-blue-700">{course.fees} ETH</span>
        }
      </div>
      {/* Paid course: payment flow */}
      {(course.fees && Number(course.fees) > 0)
        ? !paymentComplete
          ? <Button onClick={handleJoin} className="web3-button">Join & Pay Now</Button>
          : (
            <div className="mt-5 text-green-700 font-semibold">
              Payment successful! Redirecting to <span className="underline">Match</span>...
            </div>
          )
        : (
            // Free course: redirect to match page
            <Button className="web3-button" onClick={() => navigate(`/match?skill=${course.id}`)}>
              Go to Match Page
            </Button>
          )
      }
      {(!course.fees || Number(course.fees) === 0) && course.zoomLink && (
        <div className="mt-5">
          <div className="mb-1 font-bold">Zoom Link:</div>
          <div className="flex items-center gap-2">
            <span className="bg-muted px-2 py-1 rounded">{course.zoomLink}</span>
            <Button size="sm" onClick={handleCopy}><Copy className="w-4 h-4" /> Copy</Button>
          </div>
          <div className="text-sm mt-2 text-muted-foreground">Copy and store this link safely!</div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
