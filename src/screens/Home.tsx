import { useState, useEffect } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { api } from '../lib/axios';
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning';

import { HabitDay, daySize } from '../components/HabitDay'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading';
import dayjs from 'dayjs';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 5 // Quantidade de dias minima
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length

type Summary = {
    id: string; 
    date: string;
    amount: number;
    completed: number;
}[]

export function Home() {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ summary, setSummary ] = useState<Summary>([])
    const { navigate } = useNavigation(); 

    async function fetchData() {
        try {
            setIsLoading(true); 
            const response = await api.get('summary');
            setSummary(response.data.summary); 
        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possível carregar')
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    if(isLoading){
        return (
            <Loading />
        )
    }

    return (
        <View className='flex-1 bg-background px-8 pt-16'>
            <Header />

            <View className='flex-row mt-6 mb-2'>
                {
                    weekDays.map((weekDay, i) => (
                        <Text
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: daySize}}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
            

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className='flex-row flex-wrap'>
                    {
                        datesFromYearStart.map(date => {

                            const dayInSummary = summary.find(day => {
                                return dayjs(date).isSame(day.date, 'day')
                            })
                            
                            return (
                                <HabitDay 
                                    key={date.toISOString()}
                                    date={date}
                                    amount={dayInSummary?.amount}
                                    completed={dayInSummary?.completed}
                                    onPress={() => navigate('habit', { date: date.toISOString() })}
                                />
                            )
                        })
                    }
                    {
                        /* Placeholder */
                        amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill}).map((_, i) => (
                            <View 
                                key={i}
                                className='bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40'
                                style={{ width: daySize, height: daySize}}
                            />
                        ))
                    }
                </View>
            </ScrollView>
            
            
            
        </View>
    )
}