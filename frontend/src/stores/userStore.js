import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createUser } from 'src/models/User'

export const useUserStore = defineStore('user', () => {
    const users = ref([])

    function loadUsers(){
        users.value = [
            createUser({
                id: 'test_user1',
                firstName: 'user',
                lastName: 'name',
                nickName: 'username',
                email: 'user@name.com',
                password: 'password',
                color: 'black',
                channels: 'test_channel1',
                messages: ['test_message1']
            })
        ]
    }
    return {users, loadUsers}
})