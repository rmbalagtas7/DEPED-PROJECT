export const returnAccessLevelString = (access_level) => {
    let access_level_string = ""
    switch (access_level) {
        case 2048:
            access_level_string = 'Administrator'
            break;
        case 4096:
            access_level_string = 'Super Administrator'
            break;
        case 2:
            access_level_string = 'Faculty'
            break;
        default:
            access_level_string = `Student`
            break;
    }
    return access_level_string
}

export const isForStudent = (value) => {
    if (value === 3 || value === 4 || value === 5) {
        return true
    }
    return false
}

export const getFullName = (params) => {
    return `${params.getValue(params.id, 'firstName') || ''} ${
      params.getValue(params.id, 'lastName') || ''
    }`;
}
export const getStudentFullName = (params) => {
    console.log(params)
    return `${params.getValue(params.id, 'firstName') || ''} ${
      params.getValue(params.id, 'lastName') || ''
    }`;
}

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}