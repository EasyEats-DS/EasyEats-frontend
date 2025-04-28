export default function useDriversSocket() {
    const [availableDrivers, setAvailableDrivers] = useState([]);
  
    useEffect(() => {
      const socket = io(`http://${process.env.REACT_APP_BACKEND_URL}:3001`);
      
      socket.on('drivers:init', (drivers) => {
        setAvailableDrivers(drivers.filter(d => d.status === 'available'));
      });
  
      socket.on('drivers:update', (drivers) => {
        setAvailableDrivers(drivers.filter(d => d.status === 'available'));
      });
  
      return () => socket.disconnect();
    }, []);
  
    return { availableDrivers };
  }