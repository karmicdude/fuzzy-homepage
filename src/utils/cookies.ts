export function setCookie(name: string, val: string, days?: number, noDomain?: boolean) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = "; expires= " + date.toUTCString()
  }

  let domainName = getHostName(location.href)
  if (domainName !== 'localhost') { domainName = '.' + domainName }
  const domain = noDomain === true ? '' : ('; domain=' + domainName)

  const cookieStr = encodeURIComponent(name) + '=' +
    encodeURIComponent(val) +
    expires +
    domain +
    '; path=/;'
  console.log(cookieStr)
  document.cookie = cookieStr
}

export function getCookie(name: string) {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
  return decodeURIComponent(m ? m.pop() || '' : '')
}

function getHostName(url: string) {
  var m = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
  if (m != null && m.length > 2 && typeof m[2] === 'string' && m[2].length > 0) {
    return m[2]
  }
  return null
}
