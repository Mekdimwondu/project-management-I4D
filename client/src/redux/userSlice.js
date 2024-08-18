import {createSlice} from '@reduxjs/toolkit';

const userSlice=createSlice({
    name:'user',
    initialState:{
        firstName:'',
        lastName:'',
        email:'', 
        password:'',
        phoneNumber:'',
        gender:'',
        jobType: '',
        workType:'',
        experienceLevel:'',
        role:'',
        bio:'',
    },
    reducers:{setUserData:(state,action)=>{
        return{...state,...action.payload}
    },
    clearUserData:()=>{
        return{
            firstName:'',
            lastName:'',
            email:'', 
            password:'',
            phoneNumber:'',
            gender:'',
            jobType: '',
            workType:'',
            experienceLevel:'',
            role:'',
            bio:'',
        }
    }
}

})
export const{setUserData,clearUserData}=userSlice.actions;
export default userSlice.reducer;