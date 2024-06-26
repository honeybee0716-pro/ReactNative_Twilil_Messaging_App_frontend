import React ,{useState}from "react";
import { Button, Input, Stack, Text, Box, Flex, ScrollView, Toast, useToast} from "native-base";
import { TouchableOpacity } from "react-native";
import Checkbox from 'expo-checkbox';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../config/api";


const SingupScreen = ({ navigation }) => {
  const [show, setShow] = useState(true);
  const [isChecked, setChecked] = useState(false);
  const toast = useToast();
  const handleClick = () => setShow(!show);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const firstNameChangeHandler = text => {
    setFirstName(text);
  };
  
  const lastNameChangeHandler = text => {
    setLastName(text);
  };
  
  const emailChangeHandler = text => {
    setEmail(text);
  };
  
  const passwordChangeHandler = text => {
    setPassword(text);
  };
  const handleError = () =>
    toast.show({
      title: "Server is not responding",
      placement : "bottom"
    });
  const handleAxiosError = () =>
  toast.show({
    title: "There is a problem with your request or input.! ",
    placement : "bottom"
  });
  const handleSuccess = (msg) =>
    toast.show({
      title: `Hello ${msg}. You have successfully registered.`,
      placement : "bottom"
    });

  const handleSubmit = async () => {
    axios
    .post(`${API_URL}/client/signup`, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    })
    .then(async (response) => {
      console.log('===> SIGNUP', response.data);
      const { success} = response.data;
      if (success) {
        handleSuccess(response.data.user.firstName);
        await AsyncStorage.setItem("Authorization", response.data.accessToken);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          navigation.navigate("Footer");
        }, 1000);
      }else{
        handleAxiosError();
      }
    })
    .catch((error) => {
      console.log('Error: ', error);
      handleError();
    });
  };

  return (<ScrollView>
    <Stack space={5} w="85%" maxW="100%" mx="auto">
      <Flex alignItems="center" direction="row" marginTop={"50%"}>
        <Box flex={2.5}></Box>
        <Box flex={3}>
          <Text fontSize="30">Sign Up</Text>
        </Box>
        <Box flex={1.2}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text fontSize="md" color="rgba(93, 176, 117, 1)">
              Log In
            </Text>
          </TouchableOpacity>
        </Box>
      </Flex>
      <Flex alignItems="center" direction="row">
        <Box flex={1}>
          <Input size="lg" variant="outline" placeholder="First Name"  value={firstName} onChangeText={text => firstNameChangeHandler(text)} />
        </Box>
        <Box flex={0.1} />
        <Box flex={1}>
          <Input size="lg" variant="outline" placeholder="Last Name"  value={lastName} onChangeText={text => lastNameChangeHandler(text)} />
        </Box>
      </Flex>
      <Input size="lg" variant="outline" placeholder="Email or Phone Number"  value={email} onChangeText={text => emailChangeHandler(text)} />
      <Input
        size="lg"
        type={show ? "text" : "password"}  value={password} onChangeText={text => passwordChangeHandler(text)}
        InputRightElement={
          <Box flex={0.3} alignItems="center" justifyContent="center">
            <Text
              fontSize="md"
              color="rgba(93, 176, 117, 1)"
              onPress={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Text>
          </Box>
        }
        placeholder="Password"
      />
      <Flex alignItems="center" direction="row">
        <Box flex={1}>
        <Checkbox

          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? 'rgba(93, 176, 117, 1)' : undefined}
        />
        </Box>
        <Box flex={10}>
          <Text fontSize="md">
            I would like to receive your newsletter and other pomotional
            information.
          </Text>
        </Box>
      </Flex>
      <Button
        rounded={25}
        marginTop="5%"
        size="lg"
        bg="rgba(93, 176, 117, 1)"
        onPress={handleSubmit}
      >
        Sign Up
      </Button>
    </Stack>
    </ScrollView>
  );
};

export default SingupScreen;
