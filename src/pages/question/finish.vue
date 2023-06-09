<template>
<div id="result" class="w-100">
    <div id="result-title" class="has-background-light2 py-4">
        <slide-y-down-transition :duration="500">
            <div v-show="transition.after_2000" class="col-a-center">
                <h2>Result</h2>
                
                <img :src="iconSrc" />
                
                <h1>{{ resultKeyword.toUpperCase() }}</h1>
            </div>
        </slide-y-down-transition>
    </div>

    <div id="result-detail" class="has-background-white">
        <div class="container col">
            <zoom-y-transition :duration="500">
                <div id="your-score" v-show="transition.after_0">
                    <h2 class="bold">Your Score</h2>
    
                    <div class="space-between has-background-light2 rounded-5 mt-4 p-5">
                        <span>
                            <h2 class="b-700">TOEFL</h2>
                            <h2 class="b-500">Reading Test</h2>
                        </span>

                        <div class="row">
                            <span id="time-taken" class="col-a-center has-background-white rounded-4 py-3 px-4">
                                <h4>
                                    TIME TAKEN
                                </h4>
                                <h3 class="row-a-end">
                                    {{ timeTaken.length < 3 ? ('00:' + timeTaken) : timeTaken }}
                                </h3>
                            </span>
                            
                            <span id="total-score" class="col-a-center has-background-white rounded-4 py-3 px-4">
                                <h4>
                                    TOTAL SCORE
                                </h4>
                                <span class="row-a-end">
                                    <h3>
                                        <span ref="correctCount">0</span>/{{ questionCount }}
                                    </h3>
                                    <p ref="score" class="row-j-center">0.0%</p>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </zoom-y-transition>

            <slide-y-down-transition :duration="500">
                <div id="analysis" v-show="transition.after_2500">
                    <h2 class="bold">Analysis</h2>
    
                    <div class="columns mt-4">
                        <div class="column has-background-light2 rounded-5 p-5">
                            <h5>
                                Your <span class="tag-custom">Weak</span> Point
                            </h5>
        
                            <p class="has-background-white rounded-4 mt-3 p-3">
                                {{ weakPoints[correctCount] }}
                            </p>
                        </div>
    
                        <div class="column has-background-light2 rounded-5 p-5">
                            <h5>
                                Your <span class="tag-custom has-background-info">Strong</span> Point
                            </h5>
        
                            <p class="has-background-white rounded-4 mt-3 p-3">
                                {{ strongPoints[correctCount] }}
                            </p>
                        </div>
                    </div>

                    <div class="col-a-center mt-5">
                        <b-button 
                            class="btn-submit is-primary rounded-3 mt-3" 
                            @click="$router.push('/')" 
                        >
                            Retry
                        </b-button>
    
                        <p id="bottom" class="my-5">
                            Want to try more tests?
                            <a href="https://www.testglider.com/" class="underline has-text-grey-dark" target="_blank">Visit TestGlider</a>
                        </p>
                    </div>
                </div>
            </slide-y-down-transition>
        </div>
    </div>
</div>
</template>

<script lang="ts">

import { Component, Vue } from 'nuxt-property-decorator'
import { OMRState, userState } from '../../store'
import $moment from '@nuxtjs/moment'

@Component({
  middleware: 'login',
  layout: 'no-container',

  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
        if (from.name === 'question-id-id' && from.params.id === userState.userCurriculum[4].questionId) {
            OMRState.setEndTime()
            OMRState.setTimeTaken(vm.$moment.duration(vm.$moment(OMRState.endTime).diff(OMRState.startTime)).format('mm:ss'))
        }
    })
  }
})
export default class Page extends Vue {
    $moment: any
    $refs!: {
        score: HTMLDivElement
        correctCount: HTMLSpanElement
    }

    weakPoints = [
        'If this was golf, you would be doing great. But since it’s English, let’s aim for higher scores next time.',
        'They say Rome wasn’t built in a day, and neither is English mastery. Let’s keep building!',
        'Double or nothing? How about double and more! Let’s work on improving that English Score.',
        'Three is a magic number, but in this case, we want to conjure up a higher score! Aim for higher than hat-trick!',
        'A four-leaf clover - lucky - but we want to make it a bouquet of success! Almost there!',
        'Top-notch like a 5-star hotel! Keep up the excellence',
    ]
    strongPoints = [
        'Openness to receiving feedback and working on areas of improvement are noted!',
        'Efforts and willingness to build vocabulary and grammar rules are noted!',
        'Your quality of familiarity with common words and phrases are developing along with understanding of grammar rules.',
        'You have qualities of clear understanding, and comprehension of complex sentences.',
        'You have qualities of good vocabulary range, and understanding of verb tenses.',
        'You have qualities of strong vocabulary and strong understanding of idioms and expressions.',
    ]

    transition = {
        after_0: false,
        after_2000: false,
        after_2500: false,
    }

    get correctCount() {
        return OMRState.item.filter(Boolean).length
    }

    get questionCount() {
        return OMRState.n_question
    }

    get score() {
        return Number((this.correctCount / this.questionCount * 100).toFixed(1))
    }

    get resultKeyword() {
        return this.score >= 80 ? 'excellent' : this.score >= 50 ? 'good' : 'poor'
    }

    get iconSrc() {
        return require(`@/assets/icons/result/${this.resultKeyword}.svg`)
    }

    get timeTaken() {
        return OMRState.timeTaken
    }

    mounted() {
        this.setAnimationTimeout()
        this.valueUpdateAnimation(this.$refs.score, this.score)
        this.valueUpdateAnimation(this.$refs.correctCount, this.correctCount, '', 0)
    }

    setAnimationTimeout() {
        this.transition.after_0 = true
        setTimeout(() => {
            this.transition.after_2000 = true
        }, 2000)
        setTimeout(() => {
            this.transition.after_2500 = true
        }, 2500)
    }

    // <n_shares> 횟수 만큼 숫자 업데이트, <timeout> ms 대기시간 후에 실행
    valueUpdateAnimation(
        valueElement: HTMLDivElement | HTMLSpanElement, 
        realValue: number, 
        subfix: string = '%', 
        fractionDigits: number = 1,
        runtime: number = 1200,
        n_shares: number = 30, 
        timeout: number = 250,
    ) {
        valueElement.innerHTML = '0' + (fractionDigits !== 0 ? '.' + '0'.repeat(fractionDigits) : '') + subfix

        setTimeout(function() {
            let n = 1
            let set = setInterval(function() {
                valueElement.innerHTML = (realValue/n_shares*n).toFixed(fractionDigits) + subfix
                if (n==n_shares) clearInterval(set)
                n++
            }, runtime/n_shares)
        }, timeout)
    }
}

</script>

<style lang="scss">
#result {
    font-family: 'Inter';
    color: #000000;

    #result-title {
        height: 288px;

        .col-a-center {
            gap: 12px;
        }
    }
    
    #result-detail {
        padding: 32px;
    
        .container {
            max-width: 1024px;
            gap: 32px;
        }
    }
}

h2 {
    font-weight: 400;
    font-size: 24px;
    line-height: 32px;
}
h1 {
    font-weight: 700;
    font-size: 36px;
    line-height: 40px;
}
h4 {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
}
h3 {
    font-weight: 700;
    font-size: 30px;
    line-height: 36px;
}
h5 {
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
}
p {
    font-size: 16px;
    line-height: 24px;
}

#your-score {
    .row {
        gap: 1.5rem;
    }

    #total-score, #time-taken {
        width: 145px;
        gap: 8px;

        .row-a-end {
            gap: 8px;

            p {
                width: 55px;
                font-weight: 600;
                color: #6B7280;
            }
        }
    }
}

#analysis {
    .columns {
        @media screen and (max-width: 768px) {
            display: flex;
            flex-direction: column;
        }

        gap: 20px;

        p {
            font-weight: 500;
            min-height: 72px;
        }
    }

    .tag-custom {
        width: 75px;
        height: 28px;

        padding: 2px 8px;
        border-radius: 14px;

        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        color: white;
        background-color: #EF4444;
    }

    #bottom {
        color: #6B7280;

        a {
            color: #3B82F6 !important;

            &:hover {
                opacity: 0.7;
            }
        }
    }
}
</style>