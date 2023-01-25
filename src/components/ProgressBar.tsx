import { View } from 'react-native';

interface ProgresBarProps {
    progress?: number; 
}

export function ProgressBar({ progress = 0 } : ProgresBarProps){
    return(
        <View className='w-full h-3 rounded-xl bg-zinc-700 mt-4'>
            <View 
                className='h-3 rounded-xl bg-violet-600'
                style={{ width: `${progress}%` }}
            />
        </View>
    )
}