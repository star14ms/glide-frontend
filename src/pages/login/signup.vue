<template>
<section id="signup" class="col-a-center mt-5 mb-6">
    <div class="has-text-centered">
        <img src="~/assets/icons/pinata.png" width="144" class="mb-4">

        <h1 class="has-text-black bold">Join <img src="~/assets/icons/title/glide-30.svg" /></h1>
        <h2 class="mt-2">Your personalized AI Tutor for TOEFL</h2>
    </div>

    <div class="form-fields mt-5">
        <div class="form-field">
            <div class="form-field__title">
                <span class="bold">Name</span>
            </div>
            <div class="form-field__input">
                <b-field
                    :type="nameField.state" 
                    :message="[
                        { '이 입력란을 작성하세요.': nameField.name === '' },
                        { '한글, 영문, 또는 숫자 (최대 16자리)': nameField.name !== '' && nameField.available === false },
                    ]">
                    <b-input ref="nameInput" v-model="nameField.name" :placeholder="nameField.placeholder" required @input="nameCheck()"></b-input>
                </b-field>
            </div>
        </div>

        <div class="form-field">
            <div class="form-field__title">
                <span class="bold">Email</span>
            </div>
            <div class="form-field__input">
                <b-field 
                    :type="idField.state" 
                    :message="[
                        { '이 입력란을 작성하세요.': idField.id === '' },
                        { '이메일 형식': idField.id !== '' && idField.available === false },
                        { '사용가능한 아이디입니다.': idField.available },
                        { '이미 가입된 아이디입니다!': idField.duplicated },
                    ]">
                    <b-input ref="idInput" v-model="idField.id" :placeholder="idField.placeholder" required @input="idTyping()"></b-input>
                </b-field>
            </div>
        </div>

        <div class="form-field">
            <div class="form-field__title">
                <span class="bold">Password</span>
            </div>
            <div class="form-field__input">
                <b-field 
                    :type="passwordField.state" 
                    :message="[
                        {'이 입력란을 작성하세요.': passwordField.password === '' },
                        {'최소 8자': passwordField.password !== '' && passwordField.available === false },
                        {'사용할 수 있는 비밀번호입니다.': passwordField.available}
                    ]">
                    <b-input ref="passwordInput" v-model="passwordField.password" :placeholder="passwordField.placeholder" password-reveal type="password" required @input="passwordCheck()"></b-input>
                </b-field>
            </div>
        </div>

        <div class="form-field">
            <div class="form-field__title">
                <span class="bold">Confirm Password</span>
            </div>
            <div class="form-field__input">
                <b-field 
                    :type="passwordField2.state" 
                    :message="[
                        {'이 입력란을 작성하세요.': passwordField2.password === '' },
                        {'비밀번호가 다릅니다!': 
                            passwordField2.password !== null && 
                            passwordField.password !== passwordField2.password
                        },
                        {'사용할 수 있는 비밀번호입니다.': passwordField2.available}
                    ]">
                    <b-input ref="password2Input" v-model="passwordField2.password" :placeholder="passwordField2.placeholder" password-reveal type="password" required @input="passwordCheck2()" @paste.prevent></b-input>
                </b-field>
            </div>
        </div>

        <div class="form-field">
            <div class="form-field__title">
                <span class="bold">Access Token</span>
            </div>
            <div class="form-field__input">
                <b-field 
                    :type="tokenField.state" 
                    :message="[
                        {'이 입력란을 작성하세요.': tokenField.access_token === '' },
                    ]">
                    <b-input ref="tokenInput" v-model="tokenField.access_token" :placeholder="tokenField.placeholder" required @input="tokenCheck()"></b-input>
                </b-field>
            </div>
        </div>
    </div>

    <b-button 
        class="btn-submit is-primary rounded-3 mt-4" :class="{'is-loading': isLoading }"
        :disabled="isLoading" 
        @click="signUp()" 
    >
        Join
    </b-button>
</section>
</template>

<script>
export default {
    middleware: 'login',

    data() {
        return {
            nameRegex: /^[가-힣0-9a-zA-Z]{1,16}$/,
            idRegex: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            passwordRegex: /^[A-Za-z\d$@$!%*?&\-=_+]{8,}$/, // 최소 8자

            nameField: {
                available: null,
                name: null,
                state: null,
                placeholder: 'Username',
            },
            idField: {
                available: null,
                id: null,
                state: null,
                checkedId: null,
                placeholder: 'glide@gmail.com',
            },
            passwordField: {
                available: null,
                password: null,
                state: null,
                placeholder: 'Password (over 8 words)',
            },
            passwordField2: {
                available: null,
                password: null,
                state: null,
                placeholder: 'Confirm Password',
            },
            tokenField: {
                available: null,
                access_token: null,
                state: null,
                placeholder: '"흔하지 않은 영어 튜터" 페이지를 확인해주세요!',
            },

            isLoading: false,
        }
    },
    methods: {
        nameCheck() {
            this.nameField.available = this.nameRegex.test(this.nameField.name)
            this.nameField.available ? this.nameField.state = 'is-success' : this.nameField.state = 'is-danger'
        },
        async idCheck() {
            if (this.idField.available) {
                try {
                    const { data } = await this.$axios.get(`/user/idcheck/${this.idField.id}/`)

                    if (data.result) {
                        this.idField.duplicated = false
                        this.idField.duplicated ? this.idField.state = 'is-danger' : this.idField.state = 'is-success';
                        this.idField.checkedId = this.idField.id;
                    } else {
                        this.idField.available = null
                        this.idField.duplicated = true
                        this.idField.duplicated ? this.idField.state = 'is-danger' : this.idField.state = 'is-success';
                    }
                } catch (e) {
                    console.log('중복 ID 체크 에러발생 - ', e);
                    this.idField.available = null
                    this.idField.duplicated = true
                    this.idField.duplicated ? this.idField.state = 'is-danger' : this.idField.state = 'is-success';
                }
                this.idField = {...this.idField}
            }

            this.idField.available ? this.idField.state = 'is-success' : this.idField.state = 'is-danger';
        },
        idTyping() {
            this.idField.checkedId = null
            this.idField.available = this.idRegex.test(this.idField.id)
            this.idField.available ? this.idField.state = 'is-success' : this.idField.state = 'is-danger'
        },
        passwordCheck() {
            this.passwordField.available = this.passwordRegex.test(this.passwordField.password)
            return this.passwordField.available ? (this.passwordField.state = 'is-success') : (this.passwordField.state = 'is-danger')
        },
        passwordCheck2() {
            this.passwordField2.available = this.passwordRegex.test(this.passwordField2.password) &&
                this.passwordField.password === this.passwordField2.password
            return this.passwordField2.available ? (this.passwordField2.state = 'is-success') : (this.passwordField2.state = 'is-danger')
        },
        tokenCheck() {
            this.tokenField.available = this.tokenField.access_token
            this.tokenField.available ? this.tokenField.state = 'is-success' : this.tokenField.state = 'is-danger'
        },

        async signUp() {
            if (this.isLoading) return
            this.isLoading = true
            await this._signUp()
            this.isLoading = false
        },
        async _signUp() {
            if (!this.nameField.available) {
                return this.$refs.nameInput.focus()
            // } else if (!this.idField.checkedId) {
            //     return this.$refs.idInput.focus()
            } else if (!this.passwordField.available) {
                return this.$refs.passwordInput.focus()
            } else if (!this.passwordField2.available) {
                return this.$refs.password2Input.focus()
            } else if (!this.tokenField.available) {
                return this.$refs.tokenInput.focus()
            }

            const registration_data = {
                name: this.nameField.name,
                email: this.idField.id,
                password: this.passwordField.password,
                accessToken: this.tokenField.access_token,
            }

            try {
                const response = await this.$axios.post(`/auth/signup`, registration_data)
                await this.$auth.setUserToken(response.data.token)
                await this.$auth.fetchUser()
                this.$router.push('/')

                this.toast('회원가입 성공!', 'is-success')
            } catch (e) {
                this.toast(e.response?.data?.message ?? '회원가입 실패')
                this.error_log(e)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
h1 {
    font-family: 'Inter';
    font-weight: 600;
    font-size: 30px;
    line-height: 36px;

    img {
        position: relative;
        top: 2px;
        width: 72px;
    }
}

h2 {
    font-family: 'Inter';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    color: #374151;
}
</style>
