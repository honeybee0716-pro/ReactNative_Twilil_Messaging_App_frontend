import React, { useState, useEffect,useContext } from "react";
import {
  Button,
  Input,
  VStack,
  Select,
  Box,
  Stack,
  Center,
  Icon,
  Pressable,
  Flex,
  CheckIcon,
  HStack,
  Text,
  useToast
} from "native-base";
import { TouchableOpacity, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";
import StatusContext from "../context/StatusContext";


const NewCustomerScreen = ({ navigation }) => {
  const previous = useNavigation();
  const [selectedBirthDay, setSelectedBirthDay] = useState(new Date())
  const [birthDayPickerVisible, setBirthDayPickerVisible] = useState(false)
  const [locationId, setLocationId] = useState([])
  const [locationIdData, setLocationIdData] =useState([])
  const { status, setStatus } = useContext(StatusContext);
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    segment: ''
  });

  const handleChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };
  const toggleStatus = () => {
    setStatus(!status);
  };


  const handleButtonPress = () => {
    previous.goBack();
  };
  const fetchLocationData = async () => {
    const accessToken = await AsyncStorage.getItem("Authorization");
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    await axios.get(`${API_URL}/location`).then((response) =>{
      console.log("===> LOCATION",response.data.locations);
      setLocationIdData(response.data.locations);
      return true
    }).catch(error =>{
      console.log(error);
    });
  }

  useEffect(() => {
    fetchLocationData();
  }, []);

  const birthday = new Date(selectedBirthDay.getFullYear(), selectedBirthDay.getMonth(), selectedBirthDay.getDate()).toISOString();
  console.log(formData, locationId, birthday);
  const handleSuccess = (msg) =>
  toast.show({
    title: `The customer has been created successfully.`,
    placement : "bottom"
  });

  const handleAxiosError = () =>
  toast.show({
    title: "Your credentials are incorrect or a request error occurred.! ",
    placement : "bottom"
  });

  const handleError = () =>
  toast.show({
    title: "Server is not responding",
    placement : "bottom"
  });


  const showBirthDayPicker = () => {
    setBirthDayPickerVisible(true);
  };

  const hideBirthDayPicker = () => {
    setBirthDayPickerVisible(false);
  };

  const handleBirthConfirm = (date) => {
    setSelectedBirthDay(date);
    hideBirthDayPicker();
  };
  const handleSubmit = async () => {
    axios
    .post(`${API_URL}/customer`, {
      firstName:formData.firstName ,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      segment: formData.segment,
      location_id:locationId,
      birthday:birthday

    })
    .then(async (response) => {
      console.log('===> NEW HOLIDAY', response.data.status);
      const { status} = response.data;
      if (status) {
        handleSuccess();
        toggleStatus();
        setFormData({
          title:'',
          description:''
        });
        setTimeout(() => {
          navigation.navigate("Footer");
        }, 1000);
      } else{
        handleAxiosError();
      }
    }).catch((error) => {
      console.log('Error: ', error);
      handleError();
    });
  };

  return (
    <VStack
      space={7}
      alignItems="center"
      w="100%"
      h="100%"
      bg="rgba(93, 176, 117, 1)"
    >

      <DateTimePickerModal
        date={selectedBirthDay}
        isVisible={birthDayPickerVisible}
        mode="date"
        onConfirm={handleBirthConfirm}
        onCancel={hideBirthDayPicker}
      />
      <HStack marginTop={"2%"}>
        <Flex flex={0.1} alignItems={"flex-end"} justifyContent={"center"}>
          <TouchableOpacity onPress={handleButtonPress}>
            <AntDesign name="arrowleft" size={20} color="white" />
          </TouchableOpacity>
        </Flex>
        <Flex flex={0.8} justifyContent={"center"} alignItems={"center"}>
          <Text bold fontSize={20} color={"white"}>
            New Customer
          </Text>
        </Flex>
        <Flex flex={0.1}></Flex>
      </HStack>
      <ScrollView style={{ width: "100%" }}>
        <Stack
          w="100%"
          h="100%"
          bg="white"
          rounded="md"
          borderTopRadius={50}
          marginTop={"3%"}
        >
          <VStack alignItems="center" space={5} w="100%" h="100%">
            <Center
              w="140"
              h="140"
              bg="gray.200"
              rounded="full"
              shadow={3}
              zIndex={999}
              marginTop="10%"
            />
            <Flex alignItems="center" direction="row" width={"90%"}>
              <Box flex={1}>
                <Input
                  size="lg"
                  bg="gray.100"
                  placeholder="First Name"
                  rounded={"full"}
                  value={formData.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
                />
              </Box>
              <Box flex={0.1}></Box>
              <Box flex={1}>
                <Input
                  size="lg"
                  bg="gray.100"
                  placeholder="Last Name"
                  rounded={"full"}
                  value={formData.lastName}
                  onChangeText={(value) => handleChange('lastName', value)}
                />
              </Box>
            </Flex>

            <Center width={"90%"}>
              <Input
                size="lg"
                bg="gray.100"
                placeholder="Email"
                rounded={"full"}
                value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
              />
            </Center>
            <Center width={"90%"}>
              <Input
                size="lg"
                bg="gray.100"
                placeholder="Phone number"
                rounded={"full"}
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
              />
            </Center>
            <Center width={"90%"}>

              <Input
                size="lg"
                bg="gray.100"
                placeholder="Birthday"
                value={
                  selectedBirthDay
                    ? selectedBirthDay.toLocaleDateString()
                    : "No date selected"
                }
                rounded={"full"}
                InputRightElement={
                  <Pressable onPress={showBirthDayPicker}>
                    <Icon
                      as={<Feather name="calendar" size={24} color="black" />}
                      size={6}
                      mr="3"
                      color="rgba(89, 95, 103, 1)"
                    />
                  </Pressable>
                }
              />
            </Center>
            <Center width={"90%"}>
              <Input
                size="lg"
                bg="gray.100"
                placeholder="Segment"
                rounded={"full"}
                value={formData.segment}
                onChangeText={(value) => handleChange('segment', value)}
              />
            </Center>
            <Center width={"90%"}>
              <Select
                selectedValue={locationId}
                minWidth="100%"
                bg="gray.100"
                rounded="full"
                fontSize={16}
                accessibilityLabel="Location ID"
                placeholder="Location ID"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon />,
                }}
                mt={1}
                onValueChange={(itemValue) => setLocationId(itemValue)}
              > {locationIdData && locationIdData.length && locationIdData.map((item)=>(
                  <Select.Item key={item._id} label={item.address+', '+item.city+', '+item.state} value={item._id} />
              ))}
                

              </Select>
            </Center>
            <Center width={"90%"} marginTop={"25%"}>
              <Button
                onPress={handleSubmit}
                rounded={25}
                marginBottom="10"
                size="lg"
                bg="rgba(93, 176, 117, 1)"
                width={"100%"}
              >
                Save
              </Button>
            </Center>
          </VStack>
        </Stack>
      </ScrollView>
    </VStack>
  );
};

export default NewCustomerScreen;
