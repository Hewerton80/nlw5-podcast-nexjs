import moment from "moment";

/**
 * 
 * @param duration number
 * @returns string
 */
export function convertDurationToTimeString(duration: number) {
    // const hours = Math.floor(duration / (60 * 60));
    // const minutes = Math.floor((duration % 3600) / 60);
    // const seconds = duration % 60;

    // const timeString = [hours, minutes, seconds]
    //     .map(unit => String(unit).padStart(2, '0'))
    //     .join(':')

    // return timeString;
    
    const durationMoment = moment.duration(duration, 'seconds');

    const hours = String(durationMoment.hours()).padStart(2, '0');
    const minutes = String(durationMoment.minutes()).padStart(2, '0');
    const seconds = String(durationMoment.seconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`

}