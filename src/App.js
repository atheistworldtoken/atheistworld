import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import Joyride from 'react-joyride';
import { FaDiscord, FaTelegramPlane, FaTwitter, FaEnvelope, FaBars, FaInfoCircle, FaAdjust, FaSpinner, FaTimes } from 'react-icons/fa';
import { ABI, CONTRACT_ADDRESS } from './MyContractAbi';
import Chart from 'chart.js/auto';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [awtAmount, setAwtAmount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [referrer, setReferrer] = useState('');
  const [pendingRewards, setPendingRewards] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0.000001);
  const [isReferralActive, setIsReferralActive] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [ownerAWT, setOwnerAWT] = useState(0);
  const [ownerBNB, setOwnerBNB] = useState(0);
  const [userStaked, setUserStaked] = useState(0);
  const [userReferralCount, setUserReferralCount] = useState(0);
  const [loading, setLoading] = useState({ buy: false, stake: false, unstake: false, claim: false, bonus: false });
  const [isFetchingUserData, setIsFetchingUserData] = useState(false);
  const [isFetchingContractData, setIsFetchingContractData] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [notification, setNotification] = useState('');
  const [theme, setTheme] = useState('dark');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [runTour, setRunTour] = useState(!localStorage.getItem('tourCompleted'));
  const [claimedBonus, setClaimedBonus] = useState(false);
  const [welcomeBonus, setWelcomeBonus] = useState(0);
  const [minBonusBalance, setMinBonusBalance] = useState(0);
  const [maxBonusBalance, setMaxBonusBalance] = useState(0);
  const [refereeDiscountRate, setRefereeDiscountRate] = useState(0);
  const [stakeAPR, setStakeAPR] = useState(0);
  const [maxRefs, setMaxRefs] = useState(0);
  const [maxRewardPerRef, setMaxRewardPerRef] = useState(0);
  const [gasEstimateBuy, setGasEstimateBuy] = useState('');
  const [gasEstimateStake, setGasEstimateStake] = useState('');
  const [gasEstimateUnstake, setGasEstimateUnstake] = useState('');
  const [gasEstimateClaim, setGasEstimateClaim] = useState('');
  const [minStakeTime, setMinStakeTime] = useState(0);
  const [stakeStart, setStakeStart] = useState(0);
  const [autoClaim, setAutoClaim] = useState(false);
  const [referralRewards, setReferralRewards] = useState(0);
  const [expectedDiscount, setExpectedDiscount] = useState(0);
  const [pairAddress, setPairAddress] = useState('');
  const [awtUsdPrice, setAwtUsdPrice] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  // New states for dynamic min/max values
  const [minBuyAmount, setMinBuyAmount] = useState(0);
  const [maxBuyPerWallet, setMaxBuyPerWallet] = useState(0);
  const [minStakeAmount, setMinStakeAmount] = useState(0);
  const [maxStakePerUser, setMaxStakePerUser] = useState(0);

  // New states for owner inputs to change parameters
  const [newWelcomeBonus, setNewWelcomeBonus] = useState(0);
  const [newMinBonusBalance, setNewMinBonusBalance] = useState(0);
  const [newMaxBonusBalance, setNewMaxBonusBalance] = useState(0);
  const [newRefereeDiscountRate, setNewRefereeDiscountRate] = useState(0);
  const [newStakeAPR, setNewStakeAPR] = useState(0);
  const [newMaxRefs, setNewMaxRefs] = useState(0);
  const [newMaxRewardPerRef, setNewMaxRewardPerRef] = useState(0);
  const [newMinStakeTime, setNewMinStakeTime] = useState(0);
  const [newMinBuyAmount, setNewMinBuyAmount] = useState(0);
  const [newMaxBuyPerWallet, setNewMaxBuyPerWallet] = useState(0);
  const [newMinStakeAmount, setNewMinStakeAmount] = useState(0);
  const [newMaxStakePerUser, setNewMaxStakePerUser] = useState(0);

  // Reward calculator states
  const [calcStakeAmount, setCalcStakeAmount] = useState('');
  const [calcDurationMonths, setCalcDurationMonths] = useState(12);
  const [projectedReward, setProjectedReward] = useState(0);

  // Transaction history
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  // Performance metrics (assuming getters)
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0); // Assume global ref count if available

  const homeRef = useRef(null);
  const buyRef = useRef(null);
  const stakeRef = useRef(null);
  const referRef = useRef(null);
  const claimRef = useRef(null);
  const howItWorksRef = useRef(null);
  const bonusRef = useRef(null);
  const priceUpdateRef = useRef(null);
  const rewardChartRef = useRef(null);
  const paramsRef = useRef(null);
  const rewardCalcRef = useRef(null);
  const faqRef = useRef(null);
  const historyRef = useRef(null);
  const metricsRef = useRef(null);
  const metricsChartRef = useRef(null); // This line fixes the 'not defined' error
  const documentsRef = useRef(null);

  const joyrideSteps = [
    { target: '.connect-wallet', content: 'Connect your wallet to start using AWT.', placement: 'bottom' },
    { target: '.buy-awt', content: 'Buy AWT tokens with BNB and use a referral for discounts.', placement: 'top' },
    { target: '.refer-earn', content: 'Refer friends to earn rewards using your unique link.', placement: 'top' },
    { target: '.stake-awt', content: 'Stake your AWT to earn up to 20% APR.', placement: 'top' },
    { target: '.claim-bonus', content: 'Claim your welcome bonus here!', placement: 'top' },
    { target: '.price-update', content: 'Owners can update prices from oracle or DEX.', placement: 'top' },
    { target: '.params-section', content: 'View current contract parameters and conditions here.', placement: 'top' },
    { target: '.reward-calc', content: 'Use this calculator to project your staking rewards.', placement: 'top' },
    { target: '.faq-section', content: 'Read frequently asked questions here.', placement: 'top' },
    { target: '.history-section', content: 'View your transaction history.', placement: 'top' },
    { target: '.metrics-section', content: 'See performance metrics of the project.', placement: 'top' },
    { target: '.documents-section', content: 'Access project documents here.', placement: 'top' },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      setProvider(prov);
      prov.getNetwork().then(network => {
        if (network.chainId !== 56) setNotification('Please switch to BSC Mainnet (Chain ID: 56)');
      });

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          disconnectWallet();
        }
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    } else {
      setNotification('Install MetaMask or TrustWallet!');
    }
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (provider) {
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          await connectWallet();
        }
      }
    };
    checkConnection();
  }, [provider]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refFromUrl = params.get('ref');
    if (refFromUrl && ethers.isAddress(refFromUrl)) {
      setReferrer(refFromUrl);
      setNotification(`Referred by: ${refFromUrl.slice(0, 6)}...${refFromUrl.slice(-4)} - Enjoy a discount!`);
    }
  }, []);

  useEffect(() => {
    if (account) {
      setReferralLink(`${window.location.origin}?ref=${account}`);
    } else {
      setReferralLink('');
    }
  }, [account]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (!contract) return;

    const fetchExchangeRate = async () => {
      try {
        const rate = await contract.exRate();
        const newRate = Number(ethers.formatEther(rate));
        setExchangeRate(newRate > 0 ? newRate : 0.000001);
      } catch (error) {
        console.error('fetchExchangeRate error:', error);
        setErrorMsg('Failed to fetch exchange rate: ' + (error.reason || error.shortMessage || error.message || 'Unknown error'));
      }
    };

    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 600000); // Changed to 10 minutes

    return () => clearInterval(interval);
  }, [contract]);

  useEffect(() => {
    if (contract) {
      const pollInterval = setInterval(async () => {
        await updateContractData(contract);
      }, 600000); // Changed to 1 minute for faster updates
      return () => clearInterval(pollInterval);
    }
  }, [contract]);

  useEffect(() => {
    let interval;
    if (autoClaim && contract && pendingRewards > 0) {
      interval = setInterval(async () => {
        try {
          await claimReward();
        } catch (error) {
          console.error('Auto-claim failed:', error);
          setErrorMsg('Auto-claim failed: ' + (error.reason || error.shortMessage || error.message || 'Unknown error'));
        }
      }, 900000); // 15 minutes
    }
    return () => clearInterval(interval);
  }, [autoClaim, pendingRewards, contract]);

  useEffect(() => {
    const estimateGasForBuy = async () => {
      if (contract && awtAmount > 0) {
        try {
          const bnbValue = ethers.parseUnits(calculateBnbRequired().toString(), 'ether');
          const est = await contract.estimateGas.buyAWT(
            ethers.parseUnits(awtAmount, 18),
            referrer || ethers.ZeroAddress,
            { value: bnbValue }
          );
          setGasEstimateBuy(`${ethers.formatUnits(est, 'gwei')} Gwei`);
        } catch (error) {
          setGasEstimateBuy('Unable to estimate gas');
        }
      } else {
        setGasEstimateBuy('');
      }
    };
    estimateGasForBuy();
  }, [awtAmount, contract, referrer, exchangeRate]);

  useEffect(() => {
    const estimateGasForStake = async () => {
      if (contract && stakeAmount > 0) {
        try {
          const stakeWei = ethers.parseUnits(stakeAmount, 18);
          const est = await contract.estimateGas.stake(stakeWei, true);
          setGasEstimateStake(`${ethers.formatUnits(est, 'gwei')} Gwei`);
        } catch (error) {
          setGasEstimateStake('Unable to estimate gas');
        }
      } else {
        setGasEstimateStake('');
      }
    };
    estimateGasForStake();
  }, [stakeAmount, contract]);

  useEffect(() => {
    const estimateGasForUnstake = async () => {
      if (contract && unstakeAmount > 0) {
        try {
          const unstakeWei = ethers.parseUnits(unstakeAmount, 18);
          const est = await contract.estimateGas.unstake(unstakeWei);
          setGasEstimateUnstake(`${ethers.formatUnits(est, 'gwei')} Gwei`);
        } catch (error) {
          setGasEstimateUnstake('Unable to estimate gas');
        }
      } else {
        setGasEstimateUnstake('');
      }
    };
    estimateGasForUnstake();
  }, [unstakeAmount, contract]);

  useEffect(() => {
    const estimateGasForClaim = async () => {
      if (contract && pendingRewards > 0) {
        try {
          const est = await contract.estimateGas.claimReward();
          setGasEstimateClaim(`${ethers.formatUnits(est, 'gwei')} Gwei`);
        } catch (error) {
          setGasEstimateClaim('Unable to estimate gas');
        }
      } else {
        setGasEstimateClaim('');
      }
    };
    estimateGasForClaim();
  }, [pendingRewards, contract]);

  useEffect(() => {
    const fetchExpectedDiscount = async () => {
      if (contract && awtAmount > 0 && referrer && isReferralActive) {
        try {
          const awtWei = ethers.parseUnits(awtAmount, 18);
          const [discount] = await contract.getRefereeDiscount(awtWei);
          setExpectedDiscount(ethers.formatEther(discount));
        } catch (error) {
          setExpectedDiscount(0);
        }
      } else {
        setExpectedDiscount(0);
      }
    };
    fetchExpectedDiscount();
  }, [awtAmount, referrer, contract, isReferralActive]);

  useEffect(() => {
    if (rewardChartRef.current && userStaked > 0 && stakeAPR > 0) {
      const ctx = rewardChartRef.current.getContext('2d');
      if (rewardChartRef.current.chart) {
        rewardChartRef.current.chart.destroy();
      }

      const months = 12;
      const monthlyRate = stakeAPR / 12;
      const stakedNum = parseFloat(userStaked);
      const data = [];
      let cumulative = 0;

      for (let i = 1; i <= months; i++) {
        cumulative += stakedNum * monthlyRate;
        data.push(cumulative.toFixed(2));
      }

      const labels = data.map((_, idx) => `Month ${idx + 1}`);

      rewardChartRef.current.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Projected Reward Growth (AWT)',
            data: data,
            borderColor: theme === 'dark' ? 'rgb(75, 192, 192)' : 'rgb(54, 162, 235)',
            backgroundColor: theme === 'dark' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(54, 162, 235, 0.2)',
            tension: 0.1,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: theme === 'dark' ? '#fff' : '#000',
              }
            },
            x: {
              ticks: {
                color: theme === 'dark' ? '#fff' : '#000',
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: theme === 'dark' ? '#fff' : '#000',
              }
            }
          }
        }
      });
    }
  }, [userStaked, stakeAPR, theme]);

  useEffect(() => {
    if (metricsChartRef.current && (totalStaked > 0 || totalReferrals > 0)) {
      const ctx = metricsChartRef.current.getContext('2d');
      if (metricsChartRef.current.chart) {
        metricsChartRef.current.chart.destroy();
      }

      metricsChartRef.current.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Staked (AWT)', 'Total Referrals'],
          datasets: [{
            label: 'Community Insights',
            data: [totalStaked, totalReferrals],
            backgroundColor: [
              theme === 'dark' ? 'rgba(75, 192, 192, 0.8)' : 'rgba(54, 162, 235, 0.8)',
              theme === 'dark' ? 'rgba(153, 102, 255, 0.8)' : 'rgba(255, 159, 64, 0.8)',
            ],
            borderColor: [
              theme === 'dark' ? 'rgb(75, 192, 192)' : 'rgb(54, 162, 235)',
              theme === 'dark' ? 'rgb(153, 102, 255)' : 'rgb(255, 159, 64)',
            ],
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: theme === 'dark' ? '#fff' : '#000',
              }
            },
            x: {
              ticks: {
                color: theme === 'dark' ? '#fff' : '#000',
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: theme === 'dark' ? '#fff' : '#000',
              }
            }
          }
        }
      });
    }
  }, [totalStaked, totalReferrals, theme]);

  // Sync owner input states with current values
  useEffect(() => {
    setNewWelcomeBonus(welcomeBonus);
    setNewMinBonusBalance(minBonusBalance);
    setNewMaxBonusBalance(maxBonusBalance);
    setNewRefereeDiscountRate(refereeDiscountRate * 10000); // Assuming basis points
    setNewStakeAPR(stakeAPR * 10000);
    setNewMaxRefs(maxRefs);
    setNewMaxRewardPerRef(maxRewardPerRef);
    setNewMinStakeTime(minStakeTime);
    setNewMinBuyAmount(minBuyAmount);
    setNewMaxBuyPerWallet(maxBuyPerWallet);
    setNewMinStakeAmount(minStakeAmount);
    setNewMaxStakePerUser(maxStakePerUser);
  }, [welcomeBonus, minBonusBalance, maxBonusBalance, refereeDiscountRate, stakeAPR, maxRefs, maxRewardPerRef, minStakeTime, minBuyAmount, maxBuyPerWallet, minStakeAmount, maxStakePerUser]);

  // Reward calculator effect
  useEffect(() => {
    const calculateProjectedReward = () => {
      const stakeNum = parseFloat(calcStakeAmount) || 0;
      const duration = parseFloat(calcDurationMonths) || 0;
      if (stakeNum > 0 && duration > 0 && stakeAPR > 0) {
        const yearlyReward = stakeNum * stakeAPR;
        const reward = yearlyReward * (duration / 12);
        setProjectedReward(reward.toFixed(2));
      } else {
        setProjectedReward(0);
      }
    };
    calculateProjectedReward();
  }, [calcStakeAmount, calcDurationMonths, stakeAPR]);

  const connectWallet = async () => {
    if (!provider) {
      setErrorMsg('No provider available. Install MetaMask or TrustWallet.');
      return;
    }
    try {
      await provider.send('eth_requestAccounts', []);
      const sign = await provider.getSigner();
      setSigner(sign);
      const addr = await sign.getAddress();
      setAccount(addr);

      const cont = new ethers.Contract(CONTRACT_ADDRESS, ABI, sign);
      setContract(cont);

      await updateUserData(cont, addr);
      await updateContractData(cont);

      const owner = await cont.owner();
      setIsOwner(owner.toLowerCase() === addr.toLowerCase());

      // Set up WebSocket for real-time events
      const wsProvider = new ethers.WebSocketProvider('wss://bsc-ws-node.nariox.org:443');
      const wsContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wsProvider);

      wsContract.on('Transfer', async (from, to, value) => {
        if (to.toLowerCase() === addr.toLowerCase() || from.toLowerCase() === addr.toLowerCase()) {
          await updateUserData(cont, addr);
        }
        setNotification('Transfer detected! Updating data...');
      });
      wsContract.on('Staked', async (user, amt) => {
        if (user.toLowerCase() === addr.toLowerCase()) {
          setNotification(`You staked ${ethers.formatEther(amt)} AWT!`);
          await updateUserData(cont, addr);
        }
      });
      wsContract.on('BonusClaimed', async (user, amt) => {
        if (user.toLowerCase() === addr.toLowerCase()) {
          setNotification(`You claimed bonus of ${ethers.formatEther(amt)} AWT!`);
          await updateUserData(cont, addr);
        }
      });
      wsContract.on('Unstaked', async (user, amt) => {
        if (user.toLowerCase() === addr.toLowerCase()) {
          setNotification(`You unstaked ${ethers.formatEther(amt)} AWT!`);
          await updateUserData(cont, addr);
        }
      });
      wsContract.on('RewardClaimed', async (user, amt) => {
        if (user.toLowerCase() === addr.toLowerCase()) {
          setNotification(`You claimed rewards of ${ethers.formatEther(amt)} AWT!`);
          await updateUserData(cont, addr);
        }
      });
      wsContract.on('RefCountIncreased', async (referrer, newCount) => {
        if (referrer.toLowerCase() === addr.toLowerCase()) {
          setNotification(`Your referral count increased to ${newCount}!`);
          await updateUserData(cont, addr);
        }
      });
      wsContract.on('ExRateUpdated', async (oldRate, newRate) => {
        setExchangeRate(ethers.formatEther(newRate));
        setNotification(`Exchange rate updated to ${ethers.formatEther(newRate)} BNB per AWT!`);
        await updateContractData(cont);
      });
      wsContract.on('StakeAPRUpdated', async (oldAPR, newAPR) => {
        const aprPercent = (Number(newAPR) / 10000 * 100).toFixed(0);
        setStakeAPR(Number(newAPR) / 10000);
        setNotification(`Stake APR updated to ${aprPercent}%!`);
        await updateContractData(cont);
      });
      wsContract.on('RefereeDiscountRateUpdated', async (oldRate, newRate) => {
        const discountPercent = (Number(newRate) / 10000 * 100).toFixed(0);
        setRefereeDiscountRate(Number(newRate) / 10000);
        setNotification(`Referee discount rate updated to ${discountPercent}%!`);
        await updateContractData(cont);
      });
      wsContract.on('BonusUpdated', async (bonus) => {
        setWelcomeBonus(ethers.formatEther(bonus));
        setNotification('Welcome bonus updated!');
        await updateContractData(cont);
      });
      wsContract.on('MinBonusBalanceUpdated', async (oldMin, newMin) => {
        setMinBonusBalance(ethers.formatEther(newMin));
        setNotification('Min bonus balance updated!');
        await updateContractData(cont);
      });
      wsContract.on('MaxBonusBalanceUpdated', async (oldMax, newMax) => {
        setMaxBonusBalance(ethers.formatEther(newMax));
        setNotification('Max bonus balance updated!');
        await updateContractData(cont);
      });
      wsContract.on('MaxRefsUpdated', async (oldMax, newMax) => {
        setMaxRefs(Number(newMax));
        setNotification('Max referrals updated!');
        await updateContractData(cont);
      });
      wsContract.on('MaxRewardPerRefUpdated', async (oldMax, newMax) => {
        setMaxRewardPerRef(ethers.formatEther(newMax));
        setNotification('Max reward per ref updated!');
        await updateContractData(cont);
      });
      wsContract.on('MinStakeUpdated', async (oldAmt, oldTime, newAmt, newTime) => {
        setMinStakeAmount(ethers.formatEther(newAmt));
        setMinStakeTime(Number(newTime));
        setNotification('Min stake requirements updated!');
        await updateContractData(cont);
      });
      wsContract.on('MinBuyReqUpdated', async (oldAmt, oldEnabled, newAmt, newEnabled) => {
        setMinBuyAmount(ethers.formatEther(newAmt));
        setNotification('Min buy requirements updated!');
        await updateContractData(cont);
      });
      wsContract.on('MaxBuyPerWalletSet', async (oldAmt, newAmt) => {
        setMaxBuyPerWallet(ethers.formatEther(newAmt));
        setNotification('Max buy per wallet updated!');
        await updateContractData(cont);
      });
      wsContract.on('MaxStakeAmtUpdated', async (oldMax, newMax) => {
        setMaxStakePerUser(ethers.formatEther(newMax));
        setNotification('Max stake per user updated!');
        await updateContractData(cont);
      });

      setNotification('Wallet connected successfully!');
    } catch (error) {
      console.error(error);
      setErrorMsg('Connection failed: ' + (error.reason || error.shortMessage || error.message || 'Unknown error'));
    }
  };

  const disconnectWallet = () => {
    setSigner(null);
    setAccount(null);
    setContract(null);
    setBalance(0);
    setPendingRewards(0);
    setUserStaked(0);
    setUserReferralCount(0);
    setReferralRewards(0);
    setReferralLink('');
    setClaimedBonus(false);
    setIsOwner(false);
    setTransactionHistory([]);
    setTotalStaked(0);
    setTotalReferrals(0);
    setNotification('Wallet disconnected.');
  };

  const updateUserData = async (cont, addr) => {
    setIsFetchingUserData(true);
    try {
      const bal = await cont.balanceOf(addr);
      setBalance(ethers.formatEther(bal));

      const rewards = await cont.calculateReward(addr);
      setPendingRewards(ethers.formatEther(rewards));

      const stakeInfo = await cont.stakes(addr);
      setUserStaked(ethers.formatEther(stakeInfo.amt));
      setStakeStart(Number(stakeInfo.time));

      const refCount = await cont.refCount(addr);
      setUserReferralCount(refCount.toString());

      const refRewards = await cont.totalRefRewards(addr);
      setReferralRewards(ethers.formatEther(refRewards));

      const claimed = await cont.claimedBonus(addr);
      setClaimedBonus(claimed);
    } catch (error) {
      console.error('updateUserData error:', error);
      setErrorMsg('Failed to update user data: ' + (error.reason || error.shortMessage || error.message || 'Unknown error'));
    } finally {
      setIsFetchingUserData(false);
    }
  };

  const updateContractData = async (cont) => {
    setIsFetchingContractData(true);
    try {
      const maxSup = await cont.MAX_SUPPLY();
      setMaxSupply(ethers.formatEther(maxSup));

      const totSup = await cont.totalSupply();
      setTotalSupply(ethers.formatEther(totSup));

      const ownerAWTBalance = await cont.ownerAWTPool();
      setOwnerAWT(ethers.formatEther(ownerAWTBalance));

      const ownerBNBBalance = await cont.ownerBNBPool();
      setOwnerBNB(ethers.formatEther(ownerBNBBalance));

      const rate = await cont.exRate();
      setExchangeRate(Number(ethers.formatEther(rate)) || 0.000001);

      const referralActive = await cont.refOn();
      setIsReferralActive(referralActive);

      const bonus = await cont.welcomeBonus();
      setWelcomeBonus(ethers.formatEther(bonus));

      const minBonus = await cont.minBonusBalance();
      setMinBonusBalance(ethers.formatEther(minBonus));

      const maxBonus = await cont.maxBonusBalance();
      setMaxBonusBalance(ethers.formatEther(maxBonus));

      const discountRate = await cont.refereeDiscountRate();
      setRefereeDiscountRate(Number(discountRate) / 10000);

      const apr = await cont.stakeAPR();
      setStakeAPR(Number(apr) / 10000);

      const maxR = await cont.maxRefs();
      setMaxRefs(Number(maxR));

      const maxRewPerRef = await cont.maxRewardPerRef();
      setMaxRewardPerRef(ethers.formatEther(maxRewPerRef));

      const mst = await cont.minStakeTime();
      setMinStakeTime(Number(mst));

      const pair = await cont.pairAddress();
      setPairAddress(pair);

      const usdPrice = await cont.awtUsdPrice();
      setAwtUsdPrice(Number(usdPrice) / 1e8);

      // Fetch dynamic min/max values from contract
      const minBuy = await cont.minBuy();
      setMinBuyAmount(ethers.formatEther(minBuy));

      const maxBuyPw = await cont.maxBuyPerWallet();
      setMaxBuyPerWallet(ethers.formatEther(maxBuyPw));

      const minStake = await cont.minStake();
      setMinStakeAmount(ethers.formatEther(minStake));

      const maxStakePu = await cont.maxStakeAmt();
      setMaxStakePerUser(ethers.formatEther(maxStakePu));

      // Fetch performance metrics (assuming getters exist in contract)
      try {
        const totalSt = await cont.totalStaked();
        setTotalStaked(ethers.formatEther(totalSt));
      } catch (e) {
        console.warn('totalStaked getter not available');
      }
      try {
        const totalRefs = await cont.totalReferrals();
        setTotalReferrals(Number(totalRefs));
      } catch (e) {
        console.warn('totalReferrals getter not available');
      }
    } catch (error) {
      console.error('updateContractData error:', error);
      setErrorMsg('Failed to update contract data: ' + (error.reason || error.shortMessage || error.message || 'Unknown error'));
    } finally {
      setIsFetchingContractData(false);
    }
  };

  const fetchTransactionHistory = async () => {
    if (!contract || !account) return;
    setIsFetchingHistory(true);
    try {
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 1000000); // Increased to ~1 month; adjust as needed
      const events = await contract.queryFilter('*', fromBlock, 'latest');
      const userEvents = events.filter(e => 
        (e.args?.user && e.args.user.toLowerCase() === account.toLowerCase()) ||
        (e.args?.from && e.args.from.toLowerCase() === account.toLowerCase()) ||
        (e.args?.to && e.args.to.toLowerCase() === account.toLowerCase()) ||
        (e.args?.referrer && e.args.referrer.toLowerCase() === account.toLowerCase())
      );
      const history = userEvents.map(e => ({
        event: e.event,
        args: e.args,
        block: e.blockNumber,
        tx: e.transactionHash
      }));
      setTransactionHistory(history);
    } catch (error) {
      console.error('fetchHistory error:', error);
      setErrorMsg('Failed to fetch history: ' + (error.reason || error.shortMessage || error.message || 'Try increasing the block range or check network'));
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const calculateBnbRequired = () => {
    const awtNum = parseFloat(awtAmount) || 0;
    if (awtNum <= 0) return 0;
    const rate = parseFloat(exchangeRate);
    if (isNaN(rate) || rate <= 0) return 0;
    const baseBnb = awtNum * rate;
    return baseBnb > 0 ? Number(baseBnb.toFixed(6)) : 0;
  };

  const buyAWT = async () => {
    if (!contract) {
      setErrorMsg('Wallet not connected!');
      return;
    }
    const awtNum = parseFloat(awtAmount) || 0;
    if (awtNum < minBuyAmount || awtNum > maxBuyPerWallet) {
      setErrorMsg(`Enter a valid AWT amount between ${minBuyAmount} and ${maxBuyPerWallet}!`);
      return;
    }
    if (referrer && !ethers.isAddress(referrer)) {
      setErrorMsg('Invalid referrer address!');
      return;
    }
    setLoading({ ...loading, buy: true });
    setErrorMsg('');
    try {
      const bnbValue = ethers.parseUnits(calculateBnbRequired().toString(), 'ether');
      const awtWei = ethers.parseUnits(awtNum.toString(), 18);
      const tx = await contract.buyAWT(awtWei, referrer || ethers.ZeroAddress, { value: bnbValue });
      await tx.wait();
      setNotification('Buy successful! Balance updated.');
      await updateUserData(contract, account);
      await updateContractData(contract);
    } catch (error) {
      console.error('buyAWT error:', error);
      setErrorMsg('Buy failed: ' + (error.reason || error.shortMessage || error.message || 'Unknown error'));
    } finally {
      setLoading({ ...loading, buy: false });
    }
  };

  const stake = async () => {
    if (!contract) {
      setErrorMsg('Wallet not connected!');
      return;
    }
    const stakeNum = parseFloat(stakeAmount) || 0;
    if (stakeNum < minStakeAmount || stakeNum > parseFloat(balance) || (maxStakePerUser > 0 && (parseFloat(userStaked) + stakeNum) > maxStakePerUser)) {
      setErrorMsg(`Enter a valid AWT amount between ${minStakeAmount} and your balance${maxStakePerUser > 0 ? `, total stake &lt;= ${maxStakePerUser}` : ''}!`);
      return;
    }
    setLoading({ ...loading, stake: true });
    setErrorMsg('');
    try {
      const stakeWei = ethers.parseUnits(stakeNum.toString(), 18);
      const tx = await contract.stake(stakeWei, true);
      await tx.wait();
      setNotification('Stake successful! Staked amount updated.');
      await updateUserData(contract, account);
    } catch (error) {
      console.error('stake error:', error);
      setErrorMsg('Stake failed: ' + (error.reason || error.shortMessage || error.message || 'Unknown error'));
    } finally {
      setLoading({ ...loading, stake: false });
    }
  };

  const unstake = async () => {
    if (!contract) {
      setErrorMsg('Wallet not connected!');
      return;
    }
    const unstakeNum = parseFloat(unstakeAmount) || 0;
    if (unstakeNum <= 0 || unstakeNum > parseFloat(userStaked)) {
      setErrorMsg('Enter a valid positive AWT amount within your staked balance!');
      return;
    }
    setLoading({ ...loading, unstake: true });
    setErrorMsg('');
    try {
      const unstakeWei = ethers.parseUnits(unstakeNum.toString(), 18);
      const tx = await contract.unstake(unstakeWei);
      await tx.wait();
      setNotification('Unstake successful! Staked amount updated.');
      await updateUserData(contract, account);
    } catch (error) {
      console.error('unstake error:', error);
      setErrorMsg('Unstake failed: ' + (error.reason || error.shortMessage || error.message || 'Unknown error'));
    } finally {
      setLoading({ ...loading, unstake: false });
    }
  };

  const claimReward = async () => {
    if (!contract) {
      setErrorMsg('Wallet not connected!');
      return;
    }
    if (parseFloat(pendingRewards) <= 0) {
      setErrorMsg('No rewards to claim!');
      return;
    }
    setLoading({ ...loading, claim: true });
    setErrorMsg('');
    try {
      const tx = await contract.claimReward();
      await tx.wait();
      setNotification('Claim successful! Rewards updated.');
      await updateUserData(contract, account);
    } catch (error) {
      console.error('claimReward error:', error);
      setErrorMsg('Claim failed: ' + (error.reason || error.shortMessage || error.message || 'Unknown error'));
    } finally {
      setLoading({ ...loading, claim: false });
    }
  };

  const claimBonus = async () => {
    if (!contract) {
      setErrorMsg('Wallet not connected!');
      return;
    }
    if (claimedBonus) {
      setErrorMsg('Bonus already claimed!');
      return;
    }
    const bal = parseFloat(balance);
    if (bal < parseFloat(minBonusBalance) || bal > parseFloat(maxBonusBalance)) {
      setErrorMsg(`Balance must be between ${minBonusBalance} and ${maxBonusBalance} AWT!`);
      return;
    }
    setLoading({ ...loading, bonus: true });
    setErrorMsg('');
    try {
      const tx = await contract.claimBonus();
      await tx.wait();
      setNotification('Bonus claimed successfully! Balance updated.');
      await updateUserData(contract, account);
    } catch (error) {
      console.error('claimBonus error:', error);
      setErrorMsg('Bonus claim failed: ' + (error.reason || error.shortMessage || error.message || 'Unknown error'));
    } finally {
      setLoading({ ...loading, bonus: false });
    }
  };

  const updateExRateFromOracle = async () => {
    if (!contract || !isOwner) {
      setErrorMsg('Only owner can update from oracle!');
      return;
    }
    try {
      const tx = await contract.updateExRateFromOracle();
      await tx.wait();
      setNotification('Exchange rate updated from oracle!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Oracle update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const updateExRateFromDEX = async () => {
    if (!contract) {
      setErrorMsg('Wallet not connected!');
      return;
    }
    try {
      const tx = await contract.updateExRateFromDEX();
      await tx.wait();
      setNotification('Exchange rate updated from DEX!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('DEX update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewPairAddress = async () => {
    if (!contract || !isOwner) {
      setErrorMsg('Only owner can set pair address!');
      return;
    }
    if (!ethers.isAddress(pairAddress)) {
      setErrorMsg('Invalid pair address!');
      return;
    }
    try {
      const tx = await contract.setPairAddress(pairAddress);
      await tx.wait();
      setNotification('Pair address set successfully!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Set pair failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewAwtUsdPrice = async () => {
    if (!contract || !isOwner) {
      setErrorMsg('Only owner can set USD price!');
      return;
    }
    if (awtUsdPrice <= 0) {
      setErrorMsg('Invalid USD price!');
      return;
    }
    try {
      const priceWei = Math.floor(awtUsdPrice * 1e8); // 8 decimals
      const tx = await contract.setAwtUsdPrice(priceWei);
      await tx.wait();
      setNotification('AWT USD price set successfully!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Set USD price failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  // Owner parameter change functions
  const setNewWelcomeBonusFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const bonusWei = ethers.parseUnits(newWelcomeBonus.toString(), 18);
      const tx = await contract.setBonus(bonusWei);
      await tx.wait();
      setNotification('Welcome bonus updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewMinBonusBalanceFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const minWei = ethers.parseUnits(newMinBonusBalance.toString(), 18);
      const tx = await contract.setMinBonusBalance(minWei);
      await tx.wait();
      setNotification('Min bonus balance updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewMaxBonusBalanceFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const maxWei = ethers.parseUnits(newMaxBonusBalance.toString(), 18);
      const tx = await contract.setMaxBonusBalance(maxWei);
      await tx.wait();
      setNotification('Max bonus balance updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewRefereeDiscountRateFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const tx = await contract.setRefereeDiscountRate(newRefereeDiscountRate);
      await tx.wait();
      setNotification('Referee discount rate updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewStakeAPRFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const tx = await contract.setStakeAPR(newStakeAPR);
      await tx.wait();
      setNotification('Stake APR updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewMaxRefsFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const tx = await contract.setMaxRefs(newMaxRefs);
      await tx.wait();
      setNotification('Max refs updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewMaxRewardPerRefFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const rewardWei = ethers.parseUnits(newMaxRewardPerRef.toString(), 18);
      const tx = await contract.setMaxRewardPerRef(rewardWei);
      await tx.wait();
      setNotification('Max reward per ref updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewMinStakeTimeFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const tx = await contract.setMinStakeTime(newMinStakeTime);
      await tx.wait();
      setNotification('Min stake time updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewMinBuyAmountFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const minWei = ethers.parseUnits(newMinBuyAmount.toString(), 18);
      const tx = await contract.setMinBuy(minWei, true); // Assuming setMinBuyReq(amt, enabled)
      await tx.wait();
      setNotification('Min buy amount updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewMaxBuyPerWalletFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const maxWei = ethers.parseUnits(newMaxBuyPerWallet.toString(), 18);
      const tx = await contract.setMaxBuyPerWallet(maxWei);
      await tx.wait();
      setNotification('Max buy per wallet updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewMinStakeAmountFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const minWei = ethers.parseUnits(newMinStakeAmount.toString(), 18);
      const tx = await contract.setMinStakeReq(minWei, minStakeTime); // Assuming setMinStakeReq(amt, time)
      await tx.wait();
      setNotification('Min stake amount updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const setNewMaxStakePerUserFn = async () => {
    if (!contract || !isOwner) return;
    try {
      const maxWei = ethers.parseUnits(newMaxStakePerUser.toString(), 18);
      const tx = await contract.setMaxStakeAmt(maxWei);
      await tx.wait();
      setNotification('Max stake per user updated!');
      await updateContractData(contract);
    } catch (error) {
      setErrorMsg('Update failed: ' + (error.reason || error.shortMessage || error.message));
    }
  };

  const shareReferral = () => {
    if (!referralLink) {
      setErrorMsg('Connect wallet to generate referral link!');
      return;
    }
    if (navigator.share) {
      navigator.share({ url: referralLink, title: 'Join AtheistWorldToken via my referral!' })
        .then(() => setNotification('Referral link shared!'))
        .catch(() => setNotification('Failed to share referral link.'));
    } else {
      navigator.clipboard.writeText(referralLink)
        .then(() => setNotification('Referral link copied!'))
        .catch(() => setErrorMsg('Failed to copy referral link.'));
    }
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      setErrorMsg('Feedback cannot be empty!');
      return;
    }
    const mailtoLink = `mailto:help@atheistworldtoken.com?subject=User Feedback&body=${encodeURIComponent(feedbackText)}`;
    window.location.href = mailtoLink;
    setNotification('Opening email client for feedback...');
    setShowFeedback(false);
    setFeedbackText('');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
      setRunTour(false);
      localStorage.setItem('tourCompleted', 'true');
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const lockEnd = stakeStart + minStakeTime;
  const currentTime = Math.floor(Date.now() / 1000);
  const remainingLock = lockEnd - currentTime;
  const lockIndicator = remainingLock > 0 ? `Locked for another ${Math.ceil(remainingLock / 86400)} days` : 'Unlocked';

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-black';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const textTertiary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const bgCard = theme === 'dark' ? 'bg-ethena-card' : 'bg-gray-100';
  const bgInput = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderInput = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const textInput = theme === 'dark' ? 'text-white' : 'text-black';
  const bgSubCard = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  const bgProgress = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300';

  // Validation for buy
  const awtNum = parseFloat(awtAmount) || 0;
  const isValidAwtAmount = awtNum >= minBuyAmount && awtNum <= maxBuyPerWallet;
  const isValidReferrer = !referrer || ethers.isAddress(referrer);

  // Validation for stake
  const stakeNum = parseFloat(stakeAmount) || 0;
  const isValidStakeAmount = stakeNum >= minStakeAmount && stakeNum <= parseFloat(balance) && (maxStakePerUser === 0 || (parseFloat(userStaked) + stakeNum) <= maxStakePerUser);

  // Validation for unstake
  const unstakeNum = parseFloat(unstakeAmount) || 0;
  const isValidUnstakeAmount = unstakeNum > 0 && unstakeNum <= parseFloat(userStaked);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-ethena-bg text-white' : 'bg-white text-black'} font-sans relative`}>
      <Joyride
        steps={joyrideSteps}
        run={runTour}
        continuous
        showSkipButton
        styles={{
          options: { primaryColor: '#4a90e2', zIndex: 1000 },
          tooltip: { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff', color: theme === 'dark' ? '#fff' : '#000' },
        }}
        callback={handleJoyrideCallback}
      />
      {notification && (
        <div className="fixed top-24 md:top-28 right-4 bg-success-green text-white p-4 rounded-lg shadow-lg z-60 animate-fade-in max-w-[90%] md:max-w-sm">
          <p>{notification}</p>
          <button onClick={() => setNotification('')} className="mt-2 text-sm underline">Dismiss</button>
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 gradient-accent z-50 p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center">
          <img src="/logo.png" alt="AtheistWorldToken Logo" loading="lazy" className="h-10 md:h-12 object-contain transition-transform duration-300 hover:scale-105" onError={(e) => { e.target.src = '/logo-fallback.png'; console.error('Logo load error'); }} />
          <nav className="hidden md:flex ml-6 gap-6">
            <button onClick={() => scrollToSection(homeRef)} className="text-white hover:text-gray-300 transition" aria-label="Home">Home</button>
            <button onClick={() => scrollToSection(howItWorksRef)} className="text-white hover:text-gray-300 transition" aria-label="How It Works">How It Works</button>
            <button onClick={() => scrollToSection(buyRef)} className="text-white hover:text-gray-300 transition" aria-label="Buy & Refer">Buy & Refer</button>
            <button onClick={() => scrollToSection(stakeRef)} className="text-white hover:text-gray-300 transition" aria-label="Stake">Stake</button>
            <button onClick={() => scrollToSection(claimRef)} className="text-white hover:text-gray-300 transition" aria-label="Claim Rewards">Claim Rewards</button>
            {isOwner && <button onClick={() => scrollToSection(priceUpdateRef)} className="text-white hover:text-gray-300 transition" aria-label="Price Update">Price Update</button>}
            <button onClick={() => scrollToSection(rewardCalcRef)} className="text-white hover:text-gray-300 transition" aria-label="Reward Calculator">Reward Calculator</button>
            <button onClick={() => scrollToSection(faqRef)} className="text-white hover:text-gray-300 transition" aria-label="FAQ">FAQ</button>
            <button onClick={() => scrollToSection(historyRef)} className="text-white hover:text-gray-300 transition" aria-label="Transaction History">Transaction History</button>
            <button onClick={() => scrollToSection(metricsRef)} className="text-white hover:text-gray-300 transition" aria-label="Performance Metrics">Performance Metrics</button>
            <button onClick={() => scrollToSection(documentsRef)} className="text-white hover:text-gray-300 transition" aria-label="Documents">Documents</button>
            <button onClick={toggleTheme} aria-label="Toggle Theme"><FaAdjust size={20} /></button>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 connect-wallet">
          {account ? (
            <>
              <p className="text-white text-sm truncate max-w-[150px] md:max-w-none">
                {account.slice(0, 6)}...{account.slice(-4)} | {parseFloat(balance).toFixed(2)} AWT
              </p>
              <button onClick={disconnectWallet} className="bg-white text-ethena-accent px-3 py-1 rounded-lg hover:opacity-90 transition" aria-label="Disconnect Wallet">
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={connectWallet} className="bg-white text-ethena-accent px-3 py-1 rounded-lg hover:opacity-90 transition" aria-label="Connect Wallet">
              Connect Wallet
            </button>
          )}
        </div>
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Open Menu">
          <FaBars size={28} />
        </button>
      </header>

      {isMobileMenuOpen && (
        <nav className="md:hidden fixed top-[72px] left-0 right-0 bg-ethena-card p-4 z-40 shadow-lg animate-slide-down">
          <ul className="space-y-4 text-center">
            <li><button onClick={() => scrollToSection(homeRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="Home">Home</button></li>
            <li><button onClick={() => scrollToSection(howItWorksRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="How It Works">How It Works</button></li>
            <li><button onClick={() => scrollToSection(buyRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="Buy & Refer">Buy & Refer</button></li>
            <li><button onClick={() => scrollToSection(stakeRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="Stake">Stake</button></li>
            <li><button onClick={() => scrollToSection(claimRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="Claim Rewards">Claim Rewards</button></li>
            {isOwner && <li><button onClick={() => scrollToSection(priceUpdateRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="Price Update">Price Update</button></li>}
            <li><button onClick={() => scrollToSection(rewardCalcRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="Reward Calculator">Reward Calculator</button></li>
            <li><button onClick={() => scrollToSection(faqRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="FAQ">FAQ</button></li>
            <li><button onClick={() => scrollToSection(historyRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="Transaction History">Transaction History</button></li>
            <li><button onClick={() => scrollToSection(metricsRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="Performance Metrics">Performance Metrics</button></li>
            <li><button onClick={() => scrollToSection(documentsRef)} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="Documents">Documents</button></li>
            <li><button onClick={toggleTheme} className="text-white w-full py-2 hover:bg-gray-700 rounded" aria-label="Toggle Theme">Toggle Theme</button></li>
          </ul>
        </nav>
      )}

      <img src="/banner.png" alt="Blockchain Banner" loading="lazy" className="mt-[96px] md:mt-[104px] w-full h-auto object-cover transition-opacity duration-500 opacity-100" onError={(e) => { e.target.src = '/banner-fallback.png'; console.error('Banner load error'); }} onLoad={(e) => e.target.classList.add('opacity-100')} />

      <main className="p-4 md:p-8">
        <section ref={homeRef} className={`text-center mb-12 py-16 rounded-lg ${bgCard} shadow-xl animate-fade-in`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AtheistWorldToken</h1>
          <p className={`text-lg md:text-2xl ${textSecondary} mb-6`}>Grow your wealth with staking and referrals on the blockchain.</p>
          <button onClick={() => scrollToSection(buyRef)} className="bg-gradient-to-r from-ethena-accent to-blue-500 text-white px-6 py-3 rounded-full hover:scale-105 transition font-semibold shadow-md" aria-label="Start Earning">
            Start Earning with AWT
          </button>
        </section>

        {account && !claimedBonus && (
          <section ref={bonusRef} className={`claim-bonus ${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
            {isFetchingUserData || isFetchingContractData ? (
              <div className="flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
            ) : (
              <>
                <h2 className="text-3xl font-semibold mb-4 text-center" aria-label="Claim Welcome Bonus">Claim Welcome Bonus</h2>
                <p className={`${textTertiary} text-center mb-4`}>
                  Get {parseFloat(welcomeBonus).toFixed(0)} AWT bonus if your balance is between {parseFloat(minBonusBalance).toFixed(0)} and {parseFloat(maxBonusBalance).toFixed(0)} AWT.
                </p>
                <ul className="condition-list mb-4">
                  <li>One-time claim per user</li>
                  <li>Bonus program must be active</li>
                  <li>Sufficient token supply in contract</li>
                  <li>Balance within min/max limits (current: {minBonusBalance} - {maxBonusBalance} AWT)</li>
                </ul>
                <button
                  onClick={claimBonus}
                  disabled={loading.bonus}
                  className={`w-full bg-gradient-to-r from-green-600 to-green-400 text-white px-4 py-2 rounded hover:scale-105 transition shadow-md ${loading.bonus ? 'animate-pulse' : ''}`}
                  aria-label="Claim Bonus"
                >
                  {loading.bonus ? 'Claiming...' : 'Claim Bonus'}
                </button>
                {errorMsg && <p className="text-error-red mt-4 text-center">{errorMsg}</p>}
              </>
            )}
          </section>
        )}

        <section ref={howItWorksRef} className={`${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
          {isFetchingContractData ? (
            <div className="flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-6 text-center" aria-label="How It Works">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-4 ${bgSubCard} rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                  <h3 className="text-xl font-semibold mb-2">Buy AWT</h3>
                  <p className={textSecondary}>
                    Purchase AWT tokens with BNB. Use a referral link for a {(refereeDiscountRate * 100).toFixed(0)}% discount!
                  </p>
                  <ul className="condition-list">
                    <li>Referral program active (current: {isReferralActive ? 'Yes' : 'No'})</li>
                    <li>Valid referrer address</li>
                    <li>Buyer balance &lt; max referee balance</li>
                    <li>Min buy: {minBuyAmount} AWT, max per wallet: {maxBuyPerWallet} AWT</li>
                  </ul>
                </div>
                <div className={`p-4 ${bgSubCard} rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                  <h3 className="text-xl font-semibold mb-2">Stake & Earn</h3>
                  <p className={textSecondary}>
                    Stake your AWT to earn up to {(stakeAPR * 100).toFixed(0)}% APR. Rewards auto-claimed on restaking.
                  </p>
                  <ul className="condition-list">
                    <li>Min stake amount: {minStakeAmount} AWT</li>
                    <li>Min stake time: {minStakeTime / 86400} days</li>
                    <li>APR active (current: {(stakeAPR * 100).toFixed(0)}%)</li>
                    <li>Max stake per user: {maxStakePerUser > 0 ? maxStakePerUser : 'Unlimited'} AWT</li>
                  </ul>
                </div>
                <div className={`p-4 ${bgSubCard} rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                  <h3 className="text-xl font-semibold mb-2">Refer Friends</h3>
                  <p className={textSecondary}>
                    Share your referral link to earn up to {parseFloat(maxRewardPerRef).toFixed(0)} AWT per friend, max {maxRefs} referrals.
                  </p>
                  <ul className="condition-list">
                    <li>Referral program active (current: {isReferralActive ? 'Yes' : 'No'})</li>
                    <li>Max refs not reached (current max: {maxRefs})</li>
                    <li>Referee balance &lt; max</li>
                    <li>Reward cap not exceeded (per ref: {maxRewardPerRef} AWT)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4 text-center">Owner Capabilities</h3>
                <p className={`${textSecondary} text-center mb-4`}>The contract owner can adjust parameters like min/max values, rates, and times to adapt to market conditions. Changes are emitted as events and reflected in real-time here.</p>
                <ul className="condition-list text-center mx-auto max-w-2xl">
                  <li>Update welcome bonus, min/max bonus balances</li>
                  <li>Set referee discount rate, stake APR</li>
                  <li>Adjust max refs, max reward per ref</li>
                  <li>Change min stake time, min/max buy/stake amounts</li>
                  <li>Update exchange rate from oracle/DEX, set pair address, AWT USD price</li>
                </ul>
              </div>
            </>
          )}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {isFetchingContractData ? (
            <div className="col-span-4 flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
          ) : (
            <>
              <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                <p className={`${textTertiary} text-sm`}>Max Supply</p>
                <p className="text-xl font-bold">{parseFloat(maxSupply).toFixed(0)} AWT</p>
              </div>
              <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                <p className={`${textTertiary} text-sm`}>Minted Tokens</p>
                <p className="text-xl font-bold">{parseFloat(totalSupply).toFixed(0)} AWT</p>
                <div className={`w-full ${bgProgress} rounded-full h-2 mt-2`}>
                  <div className="bg-ethena-accent h-2 rounded-full transition-all duration-500" style={{ width: `${(totalSupply / maxSupply) * 100}%` }}></div>
                </div>
              </div>
              <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                <p className={`${textTertiary} text-sm`}>Owner AWT Pool</p>
                <p className="text-xl font-bold">{parseFloat(ownerAWT).toFixed(2)} AWT</p>
              </div>
              <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                <p className={`${textTertiary} text-sm`}>Owner BNB Pool</p>
                <p className="text-xl font-bold">{parseFloat(ownerBNB).toFixed(4)} BNB</p>
              </div>
            </>
          )}
        </section>

        {account && (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {isFetchingUserData ? (
              <div className="col-span-5 flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
            ) : (
              <>
                <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                  <p className={`${textTertiary} text-sm`}>AWT Balance</p>
                  <p className="text-xl font-bold">{parseFloat(balance).toFixed(2)} AWT</p>
                </div>
                <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                  <p className={`${textTertiary} text-sm`}>Staked Amount</p>
                  <p className="text-xl font-bold">{parseFloat(userStaked).toFixed(2)} AWT</p>
                </div>
                <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                  <p className={`${textTertiary} text-sm`}>Pending Rewards</p>
                  <p className="text-xl font-bold">{parseFloat(pendingRewards).toFixed(4)} AWT</p>
                </div>
                <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                  <p className={`${textTertiary} text-sm`}>Referral Count</p>
                  <p className="text-xl font-bold">{userReferralCount}</p>
                </div>
                <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
                  <p className={`${textTertiary} text-sm`}>Referral Rewards</p>
                  <p className="text-xl font-bold">{parseFloat(referralRewards).toFixed(4)} AWT</p>
                </div>
              </>
            )}
          </section>
        )}

        <section ref={buyRef} className={`buy-awt ${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
          {isFetchingContractData ? (
            <div className="flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-6 text-center" aria-label="Buy AWT & Refer Friends">Buy AWT & Refer Friends</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative p-4 bg-opacity-50 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    Buy AWT Tokens
                    <div className="tooltip ml-2">
                      <FaInfoCircle className="text-info-blue cursor-pointer" onClick={() => openModal('Buy AWT with BNB. Use a referral address for up to ' + (refereeDiscountRate * 100).toFixed(0) + '% discount. Basis points refer to 1/100th of a percentage.')} />
                      <span className="tooltiptext">Buy AWT with BNB. Use a referral address for up to {(refereeDiscountRate * 100).toFixed(0)}% discount. Basis points: 1 basis point = 0.01%.</span>
                    </div>
                  </h3>
                  <p className={`${textTertiary} text-sm mb-4`}>
                    Rate: 1 AWT = {parseFloat(exchangeRate).toFixed(6)} BNB, min {minBuyAmount}, max {maxBuyPerWallet} per wallet.
                    <br />Discount: {(refereeDiscountRate * 100).toFixed(0)}% with valid referral (if active: {isReferralActive ? 'Yes' : 'No'}).
                  </p>
                  <ul className="condition-list mb-4">
                    <li>Referral program active</li>
                    <li>Valid referrer address</li>
                    <li>Buyer balance &lt; max referee balance</li>
                    <li>Min buy: {minBuyAmount} AWT, max per wallet: {maxBuyPerWallet} AWT</li>
                  </ul>
                  <input
                    type="number"
                    value={awtAmount}
                    onChange={(e) => setAwtAmount(e.target.value)}
                    className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                    placeholder="Enter AWT amount"
                    min={minBuyAmount}
                    max={maxBuyPerWallet}
                    step="0.1"
                    aria-label="AWT Amount"
                  />
                  {!isValidAwtAmount && awtAmount && <p className="text-error-red text-sm mb-2">Amount must be between {minBuyAmount} and {maxBuyPerWallet}</p>}
                  <input
                    type="text"
                    value={referrer}
                    onChange={(e) => setReferrer(e.target.value)}
                    className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                    placeholder="Enter Referrer Address (optional)"
                    aria-label="Referrer Address"
                  />
                  {!isValidReferrer && referrer && <p className="text-error-red text-sm mb-2">Invalid referrer address</p>}
                  <p className={`${textSecondary} text-sm mb-2`}>Required BNB: {calculateBnbRequired()} BNB</p>
                  <p className={`${textSecondary} text-sm mb-2`}>Expected AWT: {(parseFloat(awtAmount || 0) + parseFloat(expectedDiscount || 0)).toFixed(2)}</p>
                  <p className={`${textSecondary} text-sm mb-4`}>Estimated Gas: {gasEstimateBuy}</p>
                  <button
                    onClick={buyAWT}
                    disabled={loading.buy || !isValidAwtAmount || !isValidReferrer}
                    className={`w-full bg-gradient-to-r from-ethena-accent to-blue-500 ${textPrimary} px-4 py-2 rounded hover:scale-105 transition shadow-md ${loading.buy || !isValidAwtAmount || !isValidReferrer ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Buy AWT"
                  >
                    {loading.buy ? 'Buying...' : 'Buy AWT'}
                  </button>
                </div>

                <div className="relative refer-earn p-4 bg-opacity-50 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    Refer & Earn
                    <div className="tooltip ml-2">
                      <FaInfoCircle className="text-info-blue cursor-pointer" onClick={() => openModal('Share your referral link to earn up to ' + maxRewardPerRef + ' AWT per friend (max ' + maxRefs + ' refs). Lock period is the minimum time your stake must remain locked.')} />
                      <span className="tooltiptext">Share your referral link to earn up to {maxRewardPerRef} AWT per friend (max {maxRefs} refs). Lock period: Minimum staking duration before unstaking.</span>
                    </div>
                  </h3>
                  <p className={`${textTertiary} text-sm mb-4`}>
                    Earn up to {parseFloat(maxRewardPerRef).toFixed(0)} AWT per friend, max {maxRefs} referrals.
                    <br />Your link: <span className="break-all">{referralLink || 'Connect wallet'}</span>
                  </p>
                  <ul className="condition-list mb-4">
                    <li>Referral program active (current: {isReferralActive ? 'Yes' : 'No'})</li>
                    <li>Max refs not reached (current max: {maxRefs})</li>
                    <li>Referee balance &lt; max</li>
                    <li>Reward cap not exceeded (per ref: {maxRewardPerRef} AWT)</li>
                  </ul>
                  <button
                    onClick={shareReferral}
                    className={`w-full bg-green-600 ${textPrimary} px-4 py-2 rounded hover:scale-105 transition shadow-md`}
                    aria-label="Share Referral Link"
                  >
                    Share Link
                  </button>
                </div>
              </div>
              {errorMsg && <p className="text-error-red mt-4 text-center">{errorMsg}</p>}
            </>
          )}
        </section>

        <section ref={stakeRef} className={`stake-awt ${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
          {isFetchingUserData || isFetchingContractData ? (
            <div className="flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center">
                Stake AWT
                <div className="tooltip ml-2">
                  <FaInfoCircle className="text-info-blue cursor-pointer" onClick={() => openModal('Stake AWT to earn up to ' + (stakeAPR * 100).toFixed(0) + '% APR. Rewards are auto-claimed when restaking. Basis points are 1/100th of a percentage point.')} />
                  <span className="tooltiptext">Stake AWT to earn up to {(stakeAPR * 100).toFixed(0)}% APR. Rewards are auto-claimed when restaking. Basis points: 1 basis point = 0.01%.</span>
                </div>
              </h2>
              <p className={`${textTertiary} text-sm mb-4 text-center`}>
                Earn {(stakeAPR * 100).toFixed(0)}% APR, min {minStakeAmount} AWT, max {maxStakePerUser > 0 ? maxStakePerUser : 'unlimited'} per user, auto-claim rewards on restaking.
                <br />Lock Status: {lockIndicator} (min time: {minStakeTime / 86400} days)
                <br />Estimated Gas: {gasEstimateStake}
              </p>
              <ul className="condition-list mb-4">
                <li>Min stake amount: {minStakeAmount} AWT</li>
                <li>Min stake time: {minStakeTime / 86400} days</li>
                <li>APR active (current: {(stakeAPR * 100).toFixed(0)}%)</li>
                <li>Max stake per user: {maxStakePerUser > 0 ? maxStakePerUser : 'Unlimited'} AWT</li>
              </ul>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                placeholder="Enter AWT amount"
                min={minStakeAmount}
                step="0.1"
                aria-label="Stake Amount"
              />
              {!isValidStakeAmount && stakeAmount && <p className="text-error-red text-sm mb-2">Amount must be between {minStakeAmount} and your balance{maxStakePerUser > 0 ? `, total stake &lt;= ${maxStakePerUser}` : ''}</p>}
              <button
                onClick={stake}
                disabled={loading.stake || !isValidStakeAmount}
                className={`w-full bg-gradient-to-r from-ethena-accent to-blue-500 ${textPrimary} px-4 py-2 rounded hover:scale-105 transition shadow-md ${loading.stake || !isValidStakeAmount ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Stake AWT"
              >
                {loading.stake ? 'Staking...' : 'Stake AWT'}
              </button>
              {errorMsg && <p className="text-error-red mt-4 text-center">{errorMsg}</p>}
            </>
          )}
        </section>

        <section className={`${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
          {isFetchingUserData || isFetchingContractData ? (
            <div className="flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center">
                Unstake AWT
                <div className="tooltip ml-2">
                  <FaInfoCircle className="text-info-blue cursor-pointer" onClick={() => openModal('Withdraw staked tokens. Rewards are automatically claimed by the contract. Lock period is the minimum time before unstaking.')} />
                  <span className="tooltiptext">Withdraw staked tokens. Rewards are automatically claimed by the contract. Lock period: Minimum staking duration before unstaking.</span>
                </div>
              </h2>
              <p className={`${textTertiary} text-sm mb-4 text-center`}>
                Withdraw staked tokens. Remaining rewards will be automatically claimed. Current staked: {parseFloat(userStaked).toFixed(2)} AWT.
                <br />Lock Status: {lockIndicator} (min time: {minStakeTime / 86400} days)
                <br />Estimated Gas: {gasEstimateUnstake}
              </p>
              <ul className="condition-list mb-4">
                <li>Sufficient staked amount</li>
                <li>Lock period elapsed (current min: {minStakeTime / 86400} days)</li>
              </ul>
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                placeholder="Enter AWT amount"
                min="0.1"
                step="0.1"
                aria-label="Unstake Amount"
              />
              {!isValidUnstakeAmount && unstakeAmount && <p className="text-error-red text-sm mb-2">Amount must be positive and &lt;= {userStaked}</p>}
              <button
                onClick={unstake}
                disabled={loading.unstake || !isValidUnstakeAmount || remainingLock > 0}
                className={`w-full bg-red-600 ${textPrimary} px-4 py-2 rounded hover:scale-105 transition shadow-md ${loading.unstake || !isValidUnstakeAmount || remainingLock > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Unstake AWT"
              >
                {loading.unstake ? 'Unstaking...' : 'Unstake AWT'}
              </button>
              {errorMsg && <p className="text-error-red mt-4 text-center">{errorMsg}</p>}
            </>
          )}
        </section>

        <section ref={claimRef} className={`${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
          {isFetchingUserData ? (
            <div className="flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center">
                Claim Rewards
                <div className="tooltip ml-2">
                  <FaInfoCircle className="text-info-blue cursor-pointer" onClick={() => openModal('Collect your staking and referral rewards. Rewards are calculated as (staked amount * APR * time) / 365 days.')} />
                  <span className="tooltiptext">Collect your staking and referral rewards. Calculation: (staked amount * APR * time) / 365 days.</span>
                </div>
              </h2>
              <p className={`${textTertiary} text-sm mb-4 text-center`}>
                Pending Rewards: {parseFloat(pendingRewards).toFixed(4)} AWT
                <br />Estimated Gas: {gasEstimateClaim}
              </p>
              <ul className="condition-list mb-4">
                <li>Sufficient rewards accumulated</li>
                <li>Stake APR active (current: {(stakeAPR * 100).toFixed(0)}%)</li>
              </ul>
              <label className="flex items-center justify-center mb-4">
                <input type="checkbox" checked={autoClaim} onChange={(e) => setAutoClaim(e.target.checked)} className="mr-2" />
                Enable Auto-Claim (every 15 minutes)
              </label>
              <button
                onClick={claimReward}
                disabled={loading.claim || parseFloat(pendingRewards) <= 0}
                className={`w-full bg-gradient-to-r from-purple-600 to-purple-400 ${textPrimary} px-4 py-2 rounded hover:scale-105 transition shadow-md ${loading.claim || parseFloat(pendingRewards) <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Claim Rewards"
              >
                {loading.claim ? 'Claiming...' : 'Claim Rewards'}
              </button>
              {errorMsg && <p className="text-error-red mt-4 text-center">{errorMsg}</p>}
            </>
          )}
        </section>

        {account && userStaked > 0 && stakeAPR > 0 && (
          <section className={`${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
            <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center">
              Reward Growth Chart
              <div className="tooltip ml-2">
                <FaInfoCircle className="text-info-blue cursor-pointer" onClick={() => openModal('Projected growth of your staking rewards over the next 12 months based on current staked amount and APR ' + (stakeAPR * 100).toFixed(0) + '%.')} />
                <span className="tooltiptext">Projected growth of your staking rewards over the next 12 months based on current staked amount and APR {(stakeAPR * 100).toFixed(0)}%.</span>
              </div>
            </h2>
            <canvas ref={rewardChartRef} className="max-w-full mx-auto"></canvas>
          </section>
        )}

        <section ref={rewardCalcRef} className={`reward-calc reward-calculator p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
          {isFetchingContractData ? (
            <div className="flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-6 text-center flex items-center justify-center">
                Reward Calculator
                <div className="tooltip ml-2">
                  <FaInfoCircle className="text-info-blue cursor-pointer" onClick={() => openModal('Enter stake amount and duration to project rewards at current APR ' + (stakeAPR * 100).toFixed(0) + '%.' )} />
                  <span className="tooltiptext">Enter stake amount and duration to project rewards at current APR {(stakeAPR * 100).toFixed(0)}%.</span>
                </div>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={`${textTertiary} block mb-2`}>Stake Amount (AWT)</label>
                  <input
                    type="number"
                    value={calcStakeAmount}
                    onChange={(e) => setCalcStakeAmount(e.target.value)}
                    className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 focus:ring-2 focus:ring-ethena-accent`}
                    placeholder="Enter stake amount"
                    min={minStakeAmount}
                    step="0.1"
                  />
                </div>
                <div>
                  <label className={`${textTertiary} block mb-2`}>Duration (Months)</label>
                  <input
                    type="number"
                    value={calcDurationMonths}
                    onChange={(e) => setCalcDurationMonths(e.target.value)}
                    className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 focus:ring-2 focus:ring-ethena-accent`}
                    placeholder="Enter months"
                    min="1"
                    max="120"
                    step="1"
                  />
                </div>
                <div className="flex items-end">
                  <div className="w-full">
                    <label className={`${textTertiary} block mb-2`}>Projected Reward (AWT)</label>
                    <p className="text-xl font-bold bg-subCard p-2 rounded">{projectedReward}</p>
                  </div>
                </div>
              </div>
              <p className={`${textTertiary} text-sm text-center`}>Calculation based on current APR: {(stakeAPR * 100).toFixed(0)}%. Actual rewards may vary if parameters change.</p>
            </>
          )}
        </section>

        <section ref={paramsRef} className={`params-section ${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
          {isFetchingContractData ? (
            <div className="flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-6 text-center">Current Contract Parameters</h2>
              {/* Desktop Table */}
              <table className="hidden md:table w-full border-collapse mb-4">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Parameter</th>
                    <th className="border px-4 py-2">Value</th>
                    <th className="border px-4 py-2">Description & Conditions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Welcome Bonus</td>
                    <td className="border px-4 py-2">{welcomeBonus} AWT</td>
                    <td className="border px-4 py-2">One-time bonus for new users with balance in range. Active if &gt; 0.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Min Bonus Balance</td>
                    <td className="border px-4 py-2">{minBonusBalance} AWT</td>
                    <td className="border px-4 py-2">Min balance to claim bonus.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Max Bonus Balance</td>
                    <td className="border px-4 py-2">{maxBonusBalance} AWT</td>
                    <td className="border px-4 py-2">Max balance to claim bonus.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Referee Discount Rate</td>
                    <td className="border px-4 py-2">{(refereeDiscountRate * 100).toFixed(0)}%</td>
                    <td className="border px-4 py-2">Discount for referred buys if program active.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Stake APR</td>
                    <td className="border px-4 py-2">{(stakeAPR * 100).toFixed(0)}%</td>
                    <td className="border px-4 py-2">Annual reward rate for staking.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Max Referrals</td>
                    <td className="border px-4 py-2">{maxRefs}</td>
                    <td className="border px-4 py-2">Max referrals per user.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Max Reward Per Ref</td>
                    <td className="border px-4 py-2">{maxRewardPerRef} AWT</td>
                    <td className="border px-4 py-2">Max reward per referral.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Min Stake Time</td>
                    <td className="border px-4 py-2">{minStakeTime / 86400} days</td>
                    <td className="border px-4 py-2">Minimum lock time for stakes.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Min Buy Amount</td>
                    <td className="border px-4 py-2">{minBuyAmount} AWT</td>
                    <td className="border px-4 py-2">Minimum purchase amount.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Max Buy Per Wallet</td>
                    <td className="border px-4 py-2">{maxBuyPerWallet} AWT</td>
                    <td className="border px-4 py-2">Maximum purchase per wallet.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Min Stake Amount</td>
                    <td className="border px-4 py-2">{minStakeAmount} AWT</td>
                    <td className="border px-4 py-2">Minimum stake amount.</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Max Stake Per User</td>
                    <td className="border px-4 py-2">{maxStakePerUser > 0 ? maxStakePerUser : 'Unlimited'} AWT</td>
                    <td className="border px-4 py-2">Maximum total stake per user.</td>
                  </tr>
                </tbody>
              </table>
              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Welcome Bonus</h3>
                  <p>{welcomeBonus} AWT</p>
                  <p className="text-sm">One-time bonus for new users with balance in range. Active if &gt; 0.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Min Bonus Balance</h3>
                  <p>{minBonusBalance} AWT</p>
                  <p className="text-sm">Min balance to claim bonus.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Max Bonus Balance</h3>
                  <p>{maxBonusBalance} AWT</p>
                  <p className="text-sm">Max balance to claim bonus.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Referee Discount Rate</h3>
                  <p>{(refereeDiscountRate * 100).toFixed(0)}%</p>
                  <p className="text-sm">Discount for referred buys if program active.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Stake APR</h3>
                  <p>{(stakeAPR * 100).toFixed(0)}%</p>
                  <p className="text-sm">Annual reward rate for staking.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Max Referrals</h3>
                  <p>{maxRefs}</p>
                  <p className="text-sm">Max referrals per user.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Max Reward Per Ref</h3>
                  <p>{maxRewardPerRef} AWT</p>
                  <p className="text-sm">Max reward per referral.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Min Stake Time</h3>
                  <p>{minStakeTime / 86400} days</p>
                  <p className="text-sm">Minimum lock time for stakes.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Min Buy Amount</h3>
                  <p>{minBuyAmount} AWT</p>
                  <p className="text-sm">Minimum purchase amount.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Max Buy Per Wallet</h3>
                  <p>{maxBuyPerWallet} AWT</p>
                  <p className="text-sm">Maximum purchase per wallet.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Min Stake Amount</h3>
                  <p>{minStakeAmount} AWT</p>
                  <p className="text-sm">Minimum stake amount.</p>
                </div>
                <div className={`${bgSubCard} p-4 rounded-lg`}>
                  <h3 className="font-semibold">Max Stake Per User</h3>
                  <p>{maxStakePerUser > 0 ? maxStakePerUser : 'Unlimited'} AWT</p>
                  <p className="text-sm">Maximum total stake per user.</p>
                </div>
              </div>
            </>
          )}
        </section>

        {isOwner && (
          <section ref={priceUpdateRef} className={`price-update price-update-section p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
            {isFetchingContractData ? (
              <div className="flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
            ) : (
              <>
                <h2 className="text-3xl font-semibold mb-6 text-center">Owner Controls (Update Parameters)</h2>
                <p className={`${textTertiary} text-center mb-4`}>As owner, you can update min/max and other parameters. Changes reflect immediately in UI for all users via events and polling.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Update from Oracle</h3>
                    <p className={`${textTertiary} text-sm mb-4`}>
                      Update exchange rate using Chainlink oracle.
                    </p>
                    <ul className="condition-list mb-4">
                      <li>Valid BNB/USD price</li>
                      <li>Data not stale (within 1 hour)</li>
                    </ul>
                    <button onClick={updateExRateFromOracle} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Update from Oracle
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Update from DEX</h3>
                    <p className={`${textTertiary} text-sm mb-4`}>
                      Update exchange rate from DEX pair reserves.
                    </p>
                    <ul className="condition-list mb-4">
                      <li>Valid pair address set</li>
                      <li>Liquidity available in pair</li>
                    </ul>
                    <button onClick={updateExRateFromDEX} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Update from DEX
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Pair Address</h3>
                    <input
                      type="text"
                      value={pairAddress}
                      onChange={(e) => setPairAddress(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter DEX Pair Address"
                    />
                    <button onClick={setNewPairAddress} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Pair Address
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set AWT USD Price</h3>
                    <input
                      type="number"
                      value={awtUsdPrice}
                      onChange={(e) => setAwtUsdPrice(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter AWT USD Price"
                      step="0.001"
                    />
                    <button onClick={setNewAwtUsdPrice} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set USD Price
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Welcome Bonus</h3>
                    <input
                      type="number"
                      value={newWelcomeBonus}
                      onChange={(e) => setNewWelcomeBonus(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new welcome bonus"
                      step="1"
                    />
                    <button onClick={setNewWelcomeBonusFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Welcome Bonus
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Min Bonus Balance</h3>
                    <input
                      type="number"
                      value={newMinBonusBalance}
                      onChange={(e) => setNewMinBonusBalance(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new min bonus balance"
                      step="1"
                    />
                    <button onClick={setNewMinBonusBalanceFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Min Bonus Balance
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Max Bonus Balance</h3>
                    <input
                      type="number"
                      value={newMaxBonusBalance}
                      onChange={(e) => setNewMaxBonusBalance(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new max bonus balance"
                      step="1"
                    />
                    <button onClick={setNewMaxBonusBalanceFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Max Bonus Balance
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Referee Discount Rate (basis points)</h3>
                    <input
                      type="number"
                      value={newRefereeDiscountRate}
                      onChange={(e) => setNewRefereeDiscountRate(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new discount rate (e.g., 2000 for 20%)"
                      step="100"
                    />
                    <button onClick={setNewRefereeDiscountRateFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Discount Rate
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Stake APR (basis points)</h3>
                    <input
                      type="number"
                      value={newStakeAPR}
                      onChange={(e) => setNewStakeAPR(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new APR (e.g., 2000 for 20%)"
                      step="100"
                    />
                    <button onClick={setNewStakeAPRFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Stake APR
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Max Referrals</h3>
                    <input
                      type="number"
                      value={newMaxRefs}
                      onChange={(e) => setNewMaxRefs(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new max referrals"
                      step="1"
                    />
                    <button onClick={setNewMaxRefsFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Max Referrals
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Max Reward Per Ref</h3>
                    <input
                      type="number"
                      value={newMaxRewardPerRef}
                      onChange={(e) => setNewMaxRewardPerRef(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new max reward per ref"
                      step="1"
                    />
                    <button onClick={setNewMaxRewardPerRefFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Max Reward Per Ref
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Min Stake Time (seconds)</h3>
                    <input
                      type="number"
                      value={newMinStakeTime}
                      onChange={(e) => setNewMinStakeTime(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new min stake time (e.g., 86400 for 1 day)"
                      step="86400"
                    />
                    <button onClick={setNewMinStakeTimeFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Min Stake Time
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Min Buy Amount</h3>
                    <input
                      type="number"
                      value={newMinBuyAmount}
                      onChange={(e) => setNewMinBuyAmount(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new min buy amount"
                      step="0.1"
                    />
                    <button onClick={setNewMinBuyAmountFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Min Buy Amount
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Max Buy Per Wallet</h3>
                    <input
                      type="number"
                      value={newMaxBuyPerWallet}
                      onChange={(e) => setNewMaxBuyPerWallet(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new max buy per wallet"
                      step="100"
                    />
                    <button onClick={setNewMaxBuyPerWalletFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Max Buy Per Wallet
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Min Stake Amount</h3>
                    <input
                      type="number"
                      value={newMinStakeAmount}
                      onChange={(e) => setNewMinStakeAmount(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new min stake amount"
                      step="1"
                    />
                    <button onClick={setNewMinStakeAmountFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Min Stake Amount
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Set Max Stake Per User (0 for unlimited)</h3>
                    <input
                      type="number"
                      value={newMaxStakePerUser}
                      onChange={(e) => setNewMaxStakePerUser(e.target.value)}
                      className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                      placeholder="Enter new max stake per user"
                      step="100"
                    />
                    <button onClick={setNewMaxStakePerUserFn} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md">
                      Set Max Stake Per User
                    </button>
                  </div>
                </div>
                {errorMsg && <p className="text-error-red mt-4 text-center">{errorMsg}</p>}
              </>
            )}
          </section>
        )}

        <section ref={faqRef} className={`${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl faq-section`}>
          <h2 className="text-3xl font-semibold mb-6 text-center">Frequently Asked Questions (FAQ)</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">What happens if parameters change during staking?</h3>
              <p className={textSecondary}>
                If parameters like APR or min stake time change during staking, new parameters apply only to new stakes. Old stakes follow old rules, but new rules may apply on unstake or claim. Always check updates. Use: View in parameters section. Conditions: Changes via owner, emitted as events.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How are rewards calculated?</h3>
              <p className={textSecondary}>
                Rewards = (staked amount * APR * time) / 365 days. APR is in basis points (1% = 100 basis points). Rewards are calculated from stake time and transferred on claim. Use: In claim section or calculator. Conditions: Staked > 0, time > 0, APR > 0.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What are basis points?</h3>
              <p className={textSecondary}>
                Basis points are a unit of measure for interest rates and percentages. 1 basis point = 0.01%. For example, 2000 basis points = 20%. Use: In rates like APR or discount. Conditions: Divided by 10000 for percentage.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What is the lock period?</h3>
              <p className={textSecondary}>
                The lock period is the minimum time your staked tokens must remain staked before you can unstake them without issues. Current: {minStakeTime / 86400} days. Use: Check in stake/unstake section. Conditions: Time since stake >= minStakeTime.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How does the referral system work?</h3>
              <p className={textSecondary}>
                Share your unique referral link. When someone buys AWT using it, you earn rewards up to {maxRewardPerRef} AWT per referral, max {maxRefs} referrals. Use: In refer section. Conditions: Program active, max not reached, valid buy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Why is the UI not updating immediately?</h3>
              <p className={textSecondary}>
                UI polls contract every 1 minute for updates to avoid frequent loading. Real-time changes via events (e.g., APR update) will notify and refresh data. Use: Wait or manual refresh if needed. Conditions: WebSocket for events.
              </p>
            </div>
          </div>
        </section>

        {account && (
          <section ref={historyRef} className={`${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl history-section`}>
            <h2 className="text-3xl font-semibold mb-6 text-center">Transaction History (Buy, Stake, Claim)</h2>
            <button onClick={fetchTransactionHistory} className="w-full bg-info-blue text-white px-4 py-2 rounded hover:scale-105 transition shadow-md mb-4">
              Load History
            </button>
            {isFetchingHistory ? (
              <div className="flex justify-center items-center"><FaSpinner className="animate-spin text-4xl" /></div>
            ) : (
              <ul className="space-y-4">
                {transactionHistory.map((tx, idx) => (
                  <li key={idx} className={`${bgSubCard} p-4 rounded-lg`}>
                    <p><strong>Event:</strong> {tx.event}</p>
                    <p><strong>Details:</strong> {JSON.stringify(tx.args, null, 2)}</p>
                    <p><strong>Block:</strong> {tx.block}</p>
                    <p><strong>Transaction Hash:</strong> {tx.tx}</p>
                  </li>
                ))}
                {transactionHistory.length === 0 && <p className="text-center">No history found in recent blocks.</p>}
              </ul>
            )}
          </section>
        )}

        <section ref={metricsRef} className={`${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl metrics-section`}>
          <h2 className="text-3xl font-semibold mb-6 text-center">Performance Metrics (Community Insights)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md`}>
              <p className={`${textTertiary} text-sm`}>Total Staked</p>
              <p className="text-xl font-bold">{parseFloat(totalStaked).toFixed(2)} AWT</p>
            </div>
            <div className={`stats-card ${bgCard} p-4 rounded-lg shadow-md`}>
              <p className={`${textTertiary} text-sm`}>Total Referrals</p>
              <p className="text-xl font-bold">{totalReferrals}</p>
            </div>
          </div>
          <div className="h-64 md:h-80">
            <canvas ref={metricsChartRef}></canvas>
          </div>
        </section>

        <section ref={documentsRef} className={`documents-section ${bgCard} p-6 rounded-lg mb-12 animate-fade-in shadow-xl`}>
          <h2 className="text-3xl font-semibold mb-6 text-center">Project Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-4 ${bgSubCard} rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
              <h3 className="text-xl font-semibold mb-2">AWT Whitepaper</h3>
              <div className="flex gap-4">
                <a href="/Atheist World Token (AWT) Whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="bg-info-blue text-white px-4 py-2 rounded hover:opacity-90">View</a>
                <a href="/Atheist World Token (AWT) Whitepaper.pdf" download className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90">Download</a>
              </div>
            </div>
            <div className={`p-4 ${bgSubCard} rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
              <h3 className="text-xl font-semibold mb-2">AWT Whitepaper (Hindi)</h3>
              <div className="flex gap-4">
                <a href="/Atheist World Token (AWT) Whitepaper_Hindi.pdf" target="_blank" rel="noopener noreferrer" className="bg-info-blue text-white px-4 py-2 rounded hover:opacity-90">View</a>
                <a href="/Atheist World Token (AWT) Whitepaper_Hindi.pdf" download className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90">Download</a>
              </div>
            </div>
            <div className={`p-4 ${bgSubCard} rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
              <h3 className="text-xl font-semibold mb-2">AWT Roadmap</h3>
              <div className="flex gap-4">
                <a href="/AWT_Roadmap.pdf" target="_blank" rel="noopener noreferrer" className="bg-info-blue text-white px-4 py-2 rounded hover:opacity-90">View</a>
                <a href="/AWT_Roadmap.pdf" download className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90">Download</a>
              </div>
            </div>
            <div className={`p-4 ${bgSubCard} rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
              <h3 className="text-xl font-semibold mb-2">Code Audit Report (English)</h3>
              <div className="flex gap-4">
                <a href="/Code_Audit_Report_AtheistWorldToken.pdf" target="_blank" rel="noopener noreferrer" className="bg-info-blue text-white px-4 py-2 rounded hover:opacity-90">View</a>
                <a href="/Code_Audit_Report_AtheistWorldToken.pdf" download className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90">Download</a>
              </div>
            </div>
            <div className={`p-4 ${bgSubCard} rounded-lg shadow-md transition-transform duration-300 hover:scale-105`}>
              <h3 className="text-xl font-semibold mb-2">Code Audit Report (Hindi)</h3>
              <div className="flex gap-4">
                <a href="/Code_Audit_Report_AtheistWorldToken_Hindi.pdf" target="_blank" rel="noopener noreferrer" className="bg-info-blue text-white px-4 py-2 rounded hover:opacity-90">View</a>
                <a href="/Code_Audit_Report_AtheistWorldToken_Hindi.pdf" download className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90">Download</a>
              </div>
            </div>
          </div>
        </section>

        {showFeedback && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`${bgCard} p-6 rounded-lg max-w-md w-full shadow-xl`}>
              <h3 className="text-xl font-semibold mb-4">User Feedback</h3>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className={`w-full ${bgInput} ${textInput} border ${borderInput} rounded p-2 mb-4 focus:ring-2 focus:ring-ethena-accent`}
                placeholder="Your feedback..."
                rows="4"
                aria-label="Feedback Text"
              />
              <div className="flex gap-4">
                <button onClick={submitFeedback} className="flex-1 bg-gradient-to-r from-ethena-accent to-blue-500 text-white px-4 py-2 rounded hover:scale-105 transition shadow-md" aria-label="Submit Feedback">
                  Send Email
                </button>
                <button onClick={() => setShowFeedback(false)} className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:scale-105 transition shadow-md" aria-label="Cancel Feedback">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`${bgCard} p-6 rounded-lg max-w-md w-full shadow-xl`}>
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold">Details</h3>
                <FaTimes className="cursor-pointer" onClick={() => setShowModal(false)} />
              </div>
              <p>{modalContent}</p>
            </div>
          </div>
        )}
      </main>

      <footer className="gradient-accent text-center text-white p-6 shadow-lg">
        <p className="mb-4">Join our community:</p>
        <div className="flex justify-center gap-8">
          <a href="https://discord.gg/yRmv2UXk" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition" aria-label="Discord"><FaDiscord size={28} /></a>
          <a href="https://t.me/+uJikM5E5HzkwNTE1" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition" aria-label="Telegram"><FaTelegramPlane size={28} /></a>
          <a href="https://x.com/teamawt" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition" aria-label="Twitter"><FaTwitter size={28} /></a>
          <a href="mailto:help@atheistworldtoken.com" className="hover:opacity-70 transition" aria-label="Email"><FaEnvelope size={28} /></a>
        </div>
        <button onClick={() => setShowFeedback(true)} className="mt-4 text-sm underline" aria-label="Give Feedback">Give Feedback</button>
        <p className="mt-6 text-sm">© 2025 AtheistWorldToken. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
