export const CNTCheck = function checkCntrno(cntrno) {
    let fi_ki
    let fi_numsum
    let fi_nummod
    let fai_num = new Array(11)
    let fb_errcntrno = false
    let fch_char, fi_sqr
    if (cntrno == null || '' == cntrno)
        return true // null不进行验证
    // if (gf_trim(cntrno)=="") return true //空不进行验证

    if (cntrno.length == 11) // 国际标准为11位，最后一位是校验位，若不是11位肯定不是标准箱
    {

        for (fi_ki = 1; fi_ki <= 11; fi_ki++)
            fai_num[fi_ki] = 0
        for (fi_ki = 1; fi_ki <= 4; fi_ki++) // 根据国际标准验证法则处理箱号前面的4个英文字母
        {
            fch_char = cntrno.charAt(fi_ki - 1).toUpperCase()
            switch (true) {
                case (fch_char == "A"): {
                    fai_num[fi_ki] = 10
                    break
                }
                case (fch_char >= "V" && fch_char <= "Z"): {
                    fai_num[fi_ki] = fch_char.charCodeAt() - 52
                    break
                }
                case (fch_char >= "L" && fch_char <= "U"): {
                    fai_num[fi_ki] = fch_char.charCodeAt() - 53
                    break
                }
                default: {
                    fai_num[fi_ki] = fch_char.charCodeAt() - 54
                    break
                }
            }
        }
        for (fi_ki = 5; fi_ki <= 11; fi_ki++) {
            fch_char = cntrno.charAt(fi_ki - 1)
            fai_num[fi_ki] = parseInt(fch_char) // ctype((mid(cntrno,
            // fi_ki, 1)), integer)
        }
        fi_numsum = 0

        for (fi_ki = 1; fi_ki <= 10; fi_ki++) {
            fi_sqr = 1
            for (let i = 1; i < fi_ki; i++) {
                fi_sqr *= 2
            }
            fi_numsum += fai_num[fi_ki] * fi_sqr
        }

        if (cntrno.substr(0, 4) == "HLCU")
            fi_numsum = fi_numsum - 2 // hapaq lloyd的柜号与国际标准相差2
        fi_nummod = fi_numsum % 11
        if (fi_nummod == 10)
            fi_nummod = 0
        if (fi_nummod == fai_num[11])
            fb_errcntrno = true
        return fb_errcntrno
    } else {
        return fb_errcntrno
    }
}