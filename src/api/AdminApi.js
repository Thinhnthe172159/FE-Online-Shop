import { fetch } from "./Fetch"

export const getAllAdmin = async () => {
    try {
        let data = await fetch.get("/admin/get-all")
        return data.data.data
    }
    catch (err) {
        console.log(err)
    }
}


export const InsertAdmins = async (content) => {
        let data = await fetch.post(`/admin/insert-admin`, content)
        return data.data
}

export const updateStatus = async (content) => {
    try {
        let data = await fetch.put(`/admin/updateStatus/${content.id}`, content)
        return data.data.data
    } catch (err) {
        console.log(err)
    }
}

export const deleteAdmin = async (content) => {
    console.log(content);
    
    try {
        let data = await fetch.delete(`/admin/delete-admin/${content}`)
        return data.data.data
    } catch (err) {
        console.log(err)
    }
}

export const updateAdmin = async (content) => {
        let data = await fetch.put(`/admin/update-admin/${content.id}`, content)
        return data.data.data

}

export const forgotPassword = async (content) => {
    const data = await fetch.post('/admin/forgot-password', null, {
        params: {
            email: content.email
        }
    });
    return data.data;
}

export const checkCode = async (content) => {
    const data = await fetch.post(`/admin/check-code`, null, {
        params: {
            code: content.code,
            email: content.email
        }
    });
    return data.data;
}

export const changePasswordByCode = async (content) => {
    console.log(content);
    let data = await fetch.post(`/admin/change-password-by-code`, {
        email: content.email,
        newPassword: content.newPassword,
        confirmPassword: content.confirmPassword
    });
    return data.data;
}

export const changePassword = async (content) => {
    console.log(content);
    let data = await fetch.post(`/admin/update-password`, content);
    return data.data.data;
    
}