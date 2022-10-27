import { FC, useEffect, useState } from 'react'
import { Dayjs } from 'dayjs'
import { useParams } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import ProfileBio from '../../components/UserProfile'
import ApiService from '../../services/ApiService'
import IUserProfile from '../../interfaces/IUserProfile'
import FilterCards from '../../components/FilterCard'
import IEventDetails from '../../interfaces/IEventDetails'
import EventCardContainer from '../../components/EventCard'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../hooks/useAuth'
import './style.css'

const Profile:FC = () => {
  const auth = useAuth()
  const [userData, setUserData] = useState<IUserProfile | null>(null)
  const [allData, setAllData] = useState<IEventDetails[]>([])
  const [currentStatus, setCurrentStatus] = useState('all')
  const [startTime, setStartTime] = useState<Dayjs|null>(null)
  const [endTime, setEndTime] = useState<Dayjs|null>(null)
  const { followerId } = useParams()
  const isBlocked = auth.user?.blocked?.includes(Number(followerId))

  useEffect(() => {
    const userInfo = async ():Promise<void> => {
      try {
        const user = await ApiService.get(`/users/${followerId}`)
        setUserData(user.data.data)
      } catch (err) {
        setUserData(null)
      }
    }
    userInfo()
  }, [followerId])

  const editUserData = async (data:any):Promise<void> => {
    try {
      const userInfo = await ApiService.put(`/users/${followerId}`, { data })
      setUserData(userInfo.data.data[0])
      auth.setUser(userInfo.data.data[0])
    } catch (err:any) {
      setUserData(null)
    }
  }

  useEffect(() => {
    const getEvents = async ():Promise<void> => {
      try {
        const allEvents = await ApiService.get('/events', {
          params: {
            status: currentStatus === 'all' ? '' : currentStatus,
            from: startTime,
            to: endTime,
            userId: followerId,
          },
        })
        setAllData(allEvents.data.data)
      } catch (err) {
        setAllData([])
      }
    }
    getEvents()
  }, [currentStatus, startTime, endTime, followerId])

  return (
    userData
    && (
    <>

      <Navbar />
      <ProfileBio
        userData={userData}
        editUserData={editUserData}
        allData={allData}
        setUserData={setUserData}
      />
      {isBlocked && (
      <Alert
        severity="error"
        variant="filled"
        sx={{ width: '40%', margin: ' 2rem auto' }}
      >
        User is blocked!
      </Alert>
      )}
      {!isBlocked && (
      <>
        <FilterCards
          currentStatus={currentStatus}
          setCurrentStatus={setCurrentStatus}
          setStartTime={setStartTime}
          startTime={startTime}
          endTime={endTime}
          setEndTime={setEndTime}
        />

        <EventCardContainer allEvents={allData} />
      </>
      )}

    </>
    )

  )
}

export default Profile
