import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


/** custom hook */
export default function useFetch(query){
    const [getData, setData] = useState({ isLoading : false, apiData: undefined, status: null, serverError: null })

    useEffect(() => {

        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true}));
                if(query){
                    const response = await axios.get(`/api/${query}`);
                    const { rest, success } =  response.data;
                    if(success){
                        setData(prev => ({ ...prev, isLoading: false}));
                        setData(prev => ({ ...prev, apiData : rest }));
                    }
                }
                else{
                    const { username } = await getUsername();
                    const response = await axios.get(`/api/user/${username}`);
                    const { rest, success } =  response.data;
                    if(success){
                        setData(prev => ({ ...prev, isLoading: false}));
                        setData(prev => ({ ...prev, apiData : rest }));
                    }
                }
                setData(prev => ({ ...prev, isLoading: false}));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        };
        fetchData()

    }, [query]);

    return [getData, setData];
}