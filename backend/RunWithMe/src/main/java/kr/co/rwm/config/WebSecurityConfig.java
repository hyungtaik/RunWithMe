package kr.co.rwm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.filter.CharacterEncodingFilter;

import kr.co.rwm.service.JwtTokenProvider;
import lombok.RequiredArgsConstructor;

/**
 * Web Security 설정
 */

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	private final JwtTokenProvider jwtTokenProvider;
	private final UserDetailsService jwtUserDetailsService;

	// 암호화에 필요한 PasswordEncoder 를 Bean 등록합니다.
	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		CharacterEncodingFilter filter = new CharacterEncodingFilter();
		filter.setEncoding("UTF-8");
        filter.setForceEncoding(true);
		
		http.csrf().disable() // 기본값이 on인 csrf 취약점 보안을 해제한다. on으로 설정해도 되나 설정할경우 웹페이지에서 추가처리가 필요함.
				.headers().frameOptions().sameOrigin(); // SockJS는 기본적으로 HTML iframe 요소를 통한 전송을 허용하지 않도록 설정되는데 해당 내용을
														// 해제한다.
//				.and().authorizeRequests()
//				.antMatchers("/chat/**").hasRole("USER") // chat으로 시작하는 리소스에 대한 접근 권한 설정
//				.anyRequest().permitAll() // 나머지 리소스에 대한 접근 설정
//				.and().addFilterBefore(filter, CsrfFilter.class)
//				.and().formLogin(); // 권한없이 페이지 접근하면 로그인 페이지로 이동한다.
//				.addFilterBefore(new CorsFilter(), SecurityContextPersistenceFilter.class).addFilterBefore(
//						new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		
		auth.userDetailsService(jwtUserDetailsService).passwordEncoder(passwordEncoder());
//		auth.userDetailsService(jwtUserDetailsService);
	}
}