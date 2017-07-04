package <%=defaultPackage%>.advice;

import <%=defaultPackage%>.annotation.MappingDiagnosticContext;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Component
@Aspect
public class LogAdvice {

    private static final String EXECUTION_SERVICE = "execution(* <%=defaultPackage%>.**..*(..))";

    @Before(EXECUTION_SERVICE)
    public void logMDCBeforeAdvice(JoinPoint joinPoint) {
        MappingDiagnosticContext annotation = isMappingDiagnosticContextAnnotationPresent(joinPoint);
        if (annotation == null) {
            return;
        }
        putMDC(joinPoint, annotation);
    }

    @After(EXECUTION_SERVICE)
    public void logMDCAfterAdvice(JoinPoint joinPoint) {
        removeFieldFromMDC(joinPoint);
    }


    @AfterThrowing(EXECUTION_SERVICE)
    public void logMDCAfterThrowingAdvice(JoinPoint joinPoint) {
        removeFieldFromMDC(joinPoint);
    }

    private void removeFieldFromMDC(JoinPoint joinPoint) {
        MappingDiagnosticContext annotation = isMappingDiagnosticContextAnnotationPresent(joinPoint);
        if (annotation == null) {
            return;
        }
        MDC.remove(annotation.field());
    }

    private void putMDC(JoinPoint joinPoint, MappingDiagnosticContext annotation) {
        Object[] args = joinPoint.getArgs();
        String field = (String) args[0];
        MDC.put(annotation.field(), field);
    }

    private MappingDiagnosticContext isMappingDiagnosticContextAnnotationPresent(JoinPoint joinPoint) {
        final MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();

        return method.getAnnotation(MappingDiagnosticContext.class);
    }
}
